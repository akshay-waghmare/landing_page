import { BaseAgent, AgentState } from './base';
import { ChromaClient } from 'chromadb';
import { OpenAIEmbeddingFunction } from 'chromadb';
import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { StateGraph, END } from '@langchain/langgraph/web';
import { Tool } from '@langchain/core/tools';

export class RealEstateAgent extends BaseAgent {
  private embeddingFunction: OpenAIEmbeddingFunction;

  constructor() {
    super(`You are an advanced AI real estate assistant specializing in property analysis and client consultation. Your capabilities include:

      1. Property Search and Recommendations:
         - Search properties based on specific criteria (location, price, size, amenities)
         - Filter and rank properties according to client preferences
         - Provide detailed property information including specifications, history, and documentation
         - Suggest alternative properties that match client requirements

      2. Market Analysis and Investment Insights:
         - Analyze current market trends and property valuations
         - Provide historical price data and appreciation patterns
         - Evaluate investment potential and ROI projections
         - Compare market performance across different neighborhoods
         - Assess market timing and seasonal factors

      3. Property Comparison and Evaluation:
         - Perform detailed comparisons of multiple properties
         - Analyze price per square foot and value metrics
         - Evaluate property condition and maintenance requirements
         - Compare amenities, features, and neighborhood factors
         - Assess potential renovation or improvement opportunities

      4. Location and Neighborhood Analysis:
         - Provide detailed neighborhood demographics and trends
         - Analyze proximity to amenities (schools, transport, shopping)
         - Evaluate safety statistics and community factors
         - Assess future development plans and zoning changes
         - Report on local services and infrastructure

      Guidelines:
      - Provide data-driven insights based on verified market information
      - Consider both short-term and long-term implications of property decisions
      - Explain complex real estate concepts in clear, accessible language
      - Be transparent about market uncertainties and risk factors
      - Maintain strict professional standards and ethical guidelines
      - Never make absolute guarantees about investment returns or appreciation
      - Always recommend professional consultation for legal, financial, and inspection matters
      - Protect client confidentiality and handle sensitive information appropriately
      - Stay updated with current market conditions and regulatory changes`);

    this.embeddingFunction = new OpenAIEmbeddingFunction({
      openai_api_key: process.env.OPENAI_API_KEY || ''
    });

    // Initialize real estate specific tools
    this.tools = [
      ...this.tools,
      new (class extends Tool {
        constructor(private agent: RealEstateAgent) { super(); }
        name = "search_properties";
        description = "Search for properties matching specific criteria";
        schema = z.object({ input: z.string().optional() }).transform(val => val.input);
        async _call(input: string) {
          const { location, minPrice, maxPrice, propertyType, bedrooms, bathrooms } = JSON.parse(input || '{}');
          const collection = await this.agent.vectorStore.getCollection({
            name: 'real_estate_knowledge',
            embeddingFunction: this.agent.embeddingFunction
          });

          const query = `${location} ${propertyType || ''} ${bedrooms || ''} bed ${bathrooms || ''} bath`;
          const where: any = { type: { $eq: 'property' } };
          if (minPrice) where.price = { ...where.price, $gte: minPrice };
          if (maxPrice) where.price = { ...where.price, $lte: maxPrice };
          if (propertyType) where.propertyType = { $eq: propertyType };
          if (bedrooms) where.bedrooms = { $eq: bedrooms };
          if (bathrooms) where.bathrooms = { $eq: bathrooms };

          const results = await collection.query({
            queryTexts: [query],
            nResults: 5,
            where
          });
          return results;
        }
      })(this),
      new (class extends Tool {
        constructor(private agent: RealEstateAgent) { super(); }
        name = "analyze_market_trends";
        description = "Analyze real estate market trends for a specific location";
        schema = z.object({ input: z.string().optional() }).transform(val => val.input);
        async _call(input: string) {
          const { location, timeframe } = JSON.parse(input || '{}');
          const collection = await this.agent.vectorStore.getCollection({
            name: 'real_estate_knowledge',
            embeddingFunction: this.agent.embeddingFunction
          });

          const results = await collection.query({
            queryTexts: [`${location} market trends ${timeframe || '1y'}`],
            nResults: 5,
            where: { type: { $eq: 'market_analysis' } }
          });
          return results;
        }
      })(this),
      new (class extends Tool {
        constructor(private agent: RealEstateAgent) { super(); }
        name = "get_neighborhood_info";
        description = "Get detailed information about a neighborhood";
        schema = z.object({ input: z.string().optional() }).transform(val => val.input);
        async _call(input: string) {
          const { location, aspectsOfInterest } = JSON.parse(input || '{}');
          const collection = await this.agent.vectorStore.getCollection({
            name: 'real_estate_knowledge',
            embeddingFunction: this.agent.embeddingFunction
          });

          const aspects = aspectsOfInterest?.join(' ') || '';
          const results = await collection.query({
            queryTexts: [`${location} neighborhood ${aspects}`],
            nResults: 5,
            where: { type: { $eq: 'neighborhood_info' } }
          });
          return results;
        }
      })(this),
      new (class extends Tool {
        constructor(private agent: RealEstateAgent) { super(); }
        name = "compare_properties";
        description = "Compare multiple properties";
        schema = z.object({ input: z.string().optional() }).transform(val => val.input);
        async _call(input: string) {
          const { propertyIds, aspects } = JSON.parse(input || '{}');
          const collection = await this.agent.vectorStore.getCollection({
            name: 'real_estate_knowledge',
            embeddingFunction: this.agent.embeddingFunction
          });

          const properties = await Promise.all(
            propertyIds.map(async (id: string) => {
              const result = await collection.get({ ids: [id] });
              return result;
            })
          );
          return this.agent.compareProperties(properties);
        }
      })(this)
    ];

    // Initialize real estate knowledge base
    this.initializeKnowledgeBase();
    
    // Re-initialize agent with updated tools
    this.initializeAgent();
  }

  private async initializeKnowledgeBase() {
    try {
      await this.vectorStore.createCollection({
        name: 'real_estate_knowledge',
        metadata: { description: 'Real estate knowledge base' },
        embeddingFunction: this.embeddingFunction
      });
    } catch (error) {
      console.log('Collection might already exist:', error);
    }
  }

  protected initializeStateGraph() {
    this.stateGraph = new StateGraph({
      channels: {
        input: { reducer: (a: any, b: any) => b },
        output: { reducer: (a: any, b: any) => b },
      },
    });

    // Add real estate specific nodes
    this.stateGraph
      .addNode("input_analysis", {
        call: async (state: AgentState) => this.processInput(state),
      })
      .addNode("property_search", {
        call: async (state: AgentState) => this.handlePropertySearch(state),
      })
      .addNode("market_analysis", {
        call: async (state: AgentState) => this.handleMarketAnalysis(state),
      })
      .addNode("neighborhood_analysis", {
        call: async (state: AgentState) => this.handleNeighborhoodAnalysis(state),
      })
      .addNode("property_comparison", {
        call: async (state: AgentState) => this.handlePropertyComparison(state),
      })
      .addNode("response_generation", {
        call: async (state: AgentState) => this.generateResponse(state),
      });

    // Define conditional edges based on task type
    this.stateGraph
      .addEdge("input_analysis", { target: "property_search", condition: (state: AgentState) => state.current_task === 'property_search' })
      .addEdge("input_analysis", { target: "market_analysis", condition: (state: AgentState) => state.current_task === 'market_analysis' })
      .addEdge("input_analysis", { target: "neighborhood_analysis", condition: (state: AgentState) => state.current_task === 'neighborhood_analysis' })
      .addEdge("input_analysis", { target: "property_comparison", condition: (state: AgentState) => state.current_task === 'property_comparison' })
      .addEdge("property_search", "response_generation")
      .addEdge("market_analysis", "response_generation")
      .addEdge("neighborhood_analysis", "response_generation")
      .addEdge("property_comparison", "response_generation")
      .addEdge("response_generation", END);

    this.stateGraph.setEntryPoint("input_analysis");
  }

  private async handlePropertySearch(state: AgentState): Promise<AgentState> {
    const searchTool = this.tools.find(t => t.name === "search_properties");
    if (!searchTool) return state;

    const result = await searchTool.call(state.context.searchCriteria || {});
    
    return {
      ...state,
      tools_output: [...(state.tools_output || []), result],
      workflow_state: 'property_search_completed',
    };
  }

  private async handleMarketAnalysis(state: AgentState): Promise<AgentState> {
    const marketTool = this.tools.find(t => t.name === "analyze_market_trends");
    if (!marketTool) return state;

    const result = await marketTool.call(state.context.marketCriteria || {});
    
    return {
      ...state,
      tools_output: [...(state.tools_output || []), result],
      workflow_state: 'market_analysis_completed',
    };
  }

  private async handleNeighborhoodAnalysis(state: AgentState): Promise<AgentState> {
    const neighborhoodTool = this.tools.find(t => t.name === "get_neighborhood_info");
    if (!neighborhoodTool) return state;

    const result = await neighborhoodTool.call(state.context.neighborhoodCriteria || {});
    
    return {
      ...state,
      tools_output: [...(state.tools_output || []), result],
      workflow_state: 'neighborhood_analysis_completed',
    };
  }

  private async handlePropertyComparison(state: AgentState): Promise<AgentState> {
    const comparisonTool = this.tools.find(t => t.name === "compare_properties");
    if (!comparisonTool) return state;

    const result = await comparisonTool.call(state.context.comparisonCriteria || {});
    
    return {
      ...state,
      tools_output: [...(state.tools_output || []), result],
      workflow_state: 'property_comparison_completed',
    };
  }

  private async compareProperties(properties: any[]): Promise<any> {
    // Implement detailed property comparison logic
    const comparison = {
      properties: properties,
      differences: {} as { [key: string]: any },
      similarities: {},
      recommendations: [] as string[],
    };

    // Compare key aspects
    const aspects = ['price', 'size', 'location', 'amenities', 'condition'];
    for (const aspect of aspects) {
      comparison.differences[aspect] = this.compareAspect(properties, aspect);
    }

    // Generate recommendations
    comparison.recommendations = this.generateRecommendations(comparison);

    return comparison;
  }

  private compareAspect(properties: any[], aspect: string): any {
    // Implement aspect comparison logic
    return {
      differences: properties.map(p => p[aspect]),
      analysis: `Analysis of ${aspect} differences`,
    };
  }

  private generateRecommendations(comparison: any): string[] {
    // Implement recommendation generation logic
    return [
      "Based on price-to-size ratio, Property A offers the best value",
      "Property B has superior location and amenities",
      "Property C might require significant renovations but has potential for appreciation"
    ];
  }
} 