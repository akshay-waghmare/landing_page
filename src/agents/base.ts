import { ChatOpenAI } from '@langchain/openai';
import { BaseMessage, HumanMessage, AIMessage, SystemMessage } from '@langchain/core/messages';
import { PromptTemplate, ChatPromptTemplate } from '@langchain/core/prompts';
import { RunnableSequence } from '@langchain/core/runnables';
import { ChromaClient } from 'chromadb';
import { StateGraph, END, StateDefinition } from '@langchain/langgraph/web';
import { Tool, StructuredTool } from '@langchain/core/tools';
import { AgentExecutor, createOpenAIFunctionsAgent } from 'langchain/agents';
import { z } from 'zod';

// Base types for our agent system
export interface AgentState {
  messages: BaseMessage[];
  context: any;
  current_task: string | null;
  memory: any[];
  workflow_state: string;
  tools_output: any[];
}

export interface AgentResponse {
  message: string;
  newState: AgentState;
}

// Base agent class that implements core functionality
export class BaseAgent {
  protected llm: ChatOpenAI;
  protected vectorStore: ChromaClient;
  protected systemPrompt: string;
  protected tools: Tool[];
  protected stateGraph: StateGraph<AgentState, any, any, any, StateDefinition, StateDefinition, StateDefinition> = {} as StateGraph<AgentState, any, any, any, StateDefinition, StateDefinition, StateDefinition>;
  protected agentExecutor: AgentExecutor = {} as AgentExecutor;

  constructor(systemPrompt: string) {
    this.llm = new ChatOpenAI({
      modelName: 'gpt-4',
      temperature: 0.7,
    });

    this.systemPrompt = systemPrompt;
    this.vectorStore = new ChromaClient();
    
    // Initialize base tools
    this.tools = [
      new class extends StructuredTool {
        name = "search_knowledge_base";
        description = "Search the knowledge base for relevant information";
        schema = z.object({ input: z.string().optional() }).transform(val => val.input);
        async _call(input: string) {
          return "Knowledge base results";
        }
      },
      new class extends StructuredTool {
        name = "update_memory";
        description = "Update the conversation memory with new information";
        schema = z.object({ input: z.string().optional() }).transform(val => val.input);
        async _call(input: string) {
          return "Memory updated";
        }
      }
    ];

    // Initialize agent executor
    this.initializeAgent();
    
    // Initialize state graph
    this.initializeStateGraph();
  }

  protected async initializeAgent() {
    const agent = await createOpenAIFunctionsAgent({
      llm: this.llm,
      tools: this.tools,
      prompt: ChatPromptTemplate.fromMessages([
        ["system", this.systemPrompt],
        ["human", "{input}"],
        ["assistant", "I will help you with that. Let me think about it step by step:"],
        ["assistant", "{agent_scratchpad}"]
      ])
    });

    this.agentExecutor = new AgentExecutor({
      agent,
      tools: this.tools,
    });
  }

  protected initializeStateGraph() {
    this.stateGraph = new StateGraph({
      channels: {
        input: { reducer: (a: any, b: any) => b },
        output: { reducer: (a: any, b: any) => b },
      },
    });

    // Add nodes for each state
    this.stateGraph
      .addNode("input_analysis", {
        call: async (state: AgentState) => this.processInput(state),
      })
      .addNode("context_retrieval", {
        call: async (state: AgentState) => this.retrieveContext(state),
      })
      .addNode("tool_execution", {
        call: async (state: AgentState) => this.executeTool(state),
      })
      .addNode("response_generation", {
        call: async (state: AgentState) => this.generateResponse(state),
      });

    // Define edges
    this.stateGraph
      .addEdge("input_analysis", "context_retrieval")
      .addEdge("context_retrieval", "tool_execution")
      .addEdge("tool_execution", "response_generation")
      .addEdge("response_generation", END);

    this.stateGraph.setEntryPoint("input_analysis");
  }

  // Process user input and determine the next steps
  protected async processInput(state: AgentState): Promise<AgentState> {
    const lastMessage = state.messages[state.messages.length - 1];
    const result = await this.agentExecutor.invoke({
      input: lastMessage.content,
    });

    return {
      ...state,
      current_task: 'processing_input',
      workflow_state: 'input_analyzed',
      tools_output: [...(state.tools_output || []), result],
    };
  }

  // Retrieve relevant context using RAG
  protected async retrieveContext(state: AgentState): Promise<AgentState> {
    const lastMessage = state.messages[state.messages.length - 1];
    const messageContent = typeof lastMessage.content === 'string' 
      ? lastMessage.content 
      : JSON.stringify(lastMessage.content);
    
    // Use the search_knowledge_base tool
    const result = await this.tools[0].call(messageContent);
    
    return {
      ...state,
      context: result,
      current_task: 'context_retrieved',
      workflow_state: 'context_retrieved',
    };
  }

  // Execute relevant tools based on the current state
  protected async executeTool(state: AgentState): Promise<AgentState> {
    const toolResults = await this.agentExecutor.invoke({
      input: JSON.stringify({
        messages: state.messages,
        context: state.context,
        current_task: state.current_task,
      }),
    });

    return {
      ...state,
      tools_output: [...(state.tools_output || []), toolResults],
      workflow_state: 'tools_executed',
    };
  }

  // Generate a response using the LLM
  protected async generateResponse(state: AgentState): Promise<AgentState> {
    const prompt = PromptTemplate.fromTemplate(`
      System: ${this.systemPrompt}
      Context: ${JSON.stringify(state.context)}
      Tool outputs: ${JSON.stringify(state.tools_output)}
      
      Previous conversation:
      ${state.memory.map(m => `${m.role}: ${m.content}`).join('\n')}
      
      User: ${state.messages[state.messages.length - 1].content}
      
      Assistant: Let me help you with that.
    `);

    const chain = RunnableSequence.from([prompt, this.llm]);
    const response = await chain.invoke({});
    const messageContent = typeof response.content === 'string' 
      ? response.content 
      : JSON.stringify(response.content);

    // Update memory
    await this.tools[1].call(messageContent);

    return {
      ...state,
      messages: [
        ...state.messages,
        new AIMessage(messageContent),
      ],
      current_task: 'response_generated',
      workflow_state: 'completed',
    };
  }

  // Main method to process a message
  public async processMessage(message: string, currentState: AgentState): Promise<AgentResponse> {
    const initialState: AgentState = {
      ...currentState,
      messages: [
        ...currentState.messages,
        new HumanMessage(message),
      ],
      workflow_state: 'started',
      tools_output: [],
    };

    // Execute the state graph
    const finalState = (await this.stateGraph.compile().invoke(initialState)) as AgentState;

    const lastMessage = finalState.messages[finalState.messages.length - 1];
    const messageContent = typeof lastMessage.content === 'string' 
      ? lastMessage.content 
      : JSON.stringify(lastMessage.content);

    return {
      message: messageContent,
      newState: finalState,
    };
  }
} 