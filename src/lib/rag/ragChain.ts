import { OpenAI } from '@langchain/openai';
import { RunnableSequence } from '@langchain/core/runnables';
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from '@langchain/openai';
import { Document } from '@langchain/core/documents';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { ChatPromptTemplate } from '@langchain/core/prompts';

// Simple in-memory document store for the mock implementation
class MockDocumentStore {
    private documents: string[] = [];

    addDocuments(docs: string[]) {
        this.documents.push(...docs);
    }

    search(query: string): string[] {
        // Very simple "search" that returns documents containing any word from the query
        const queryWords = query.toLowerCase().split(/\s+/).filter(word => word.length > 3);
        
        if (queryWords.length === 0) {
            return this.documents.slice(0, 2); // Return first two docs if no significant words
        }
        
        const matches = this.documents.filter(doc => 
            queryWords.some(word => doc.toLowerCase().includes(word))
        );
        
        return matches.length > 0 ? matches : this.documents.slice(0, 2);
    }
}

export class RAGChain {
    private vectorStore: MemoryVectorStore | null = null;
    private model: OpenAI | null = null;
    private chain: RunnableSequence | null = null;
    private mockStore: MockDocumentStore;
    private usesMock: boolean = false;

    constructor(apiKey: string) {
        this.mockStore = new MockDocumentStore();
        
        // Try to initialize with real API if key is provided
        if (apiKey && apiKey.length > 10) {
            try {
                this.model = new OpenAI({
                    openAIApiKey: apiKey,
                    modelName: 'gpt-3.5-turbo',
                    temperature: 0.7,
                });

                const embeddings = new OpenAIEmbeddings({
                    openAIApiKey: apiKey,
                });

                this.vectorStore = new MemoryVectorStore(embeddings);

                const prompt = ChatPromptTemplate.fromTemplate(`
                    Answer the question based on the following context:
                    Context: {context}
                    Question: {question}
                    
                    If you don't know the answer, just say you don't know. Don't try to make up an answer.
                    Answer in a helpful and friendly tone.
                `);

                this.chain = RunnableSequence.from([
                    {
                        context: async (input: { question: string }) => {
                            if (!this.vectorStore) {
                                return "No documents available.";
                            }
                            const relevantDocs = await this.vectorStore.similaritySearch(input.question, 3);
                            return relevantDocs.map((doc: Document) => doc.pageContent).join('\n');
                        },
                        question: (input: { question: string }) => input.question,
                    },
                    prompt,
                    this.model,
                    new StringOutputParser(),
                ]);
                
                console.log("RAGChain initialized with real OpenAI API");
            } catch (error) {
                console.error("Error initializing RAGChain with real API:", error);
                this.usesMock = true;
            }
        } else {
            console.log("Using mock RAGChain implementation");
            this.usesMock = true;
        }
    }

    async addDocuments(documents: string[]) {
        // Always add to mock store for fallback
        this.mockStore.addDocuments(documents);
        
        // If real store is available, add there too
        if (this.vectorStore && !this.usesMock) {
            const docs = documents.map(
                (pageContent) => new Document({ pageContent })
            );
            await this.vectorStore.addDocuments(docs);
        }
    }

    async query(question: string): Promise<string> {
        try {
            // If we have a real chain and we're not using mock, use it
            if (this.chain && !this.usesMock) {
                const response = await this.chain.invoke({
                    question: question,
                });
                return response;
            } else {
                // Use mock implementation
                return await this.mockQuery(question);
            }
        } catch (error) {
            console.error('Error in RAG query:', error);
            // Fallback to mock if real query fails
            return await this.mockQuery(question);
        }
    }
    
    private async mockQuery(question: string): Promise<string> {
        // Simulate a delay to make it feel more realistic
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Get relevant documents from mock store
        const relevantDocs = this.mockStore.search(question);
        
        // Simple predefined responses for common questions
        if (question.toLowerCase().includes('hello') || question.toLowerCase().includes('hi')) {
            return "Hello! How can I assist you today?";
        }
        
        if (question.toLowerCase().includes('who are you') || question.toLowerCase().includes('what are you')) {
            return "I'm Perceptra AI, your intelligent assistant. I can help answer questions about our services and capabilities.";
        }
        
        if (question.toLowerCase().includes('help')) {
            return "I'd be happy to help! You can ask me about Perceptra's AI solutions, our expertise in natural language processing, or how our technology can benefit your business.";
        }
        
        // If we have relevant documents, use them to craft a response
        if (relevantDocs.length > 0) {
            const context = relevantDocs.join(" ");
            
            // Very simple "answer generation" based on the context
            if (question.toLowerCase().includes('what') && context.includes('Perceptra')) {
                return `Perceptra is an AI company that provides innovative solutions for businesses. ${context}`;
            }
            
            if (question.toLowerCase().includes('how')) {
                return `We can help you by leveraging our expertise in artificial intelligence and machine learning. ${context}`;
            }
            
            // Generic response using the context
            return `Based on what I know: ${context}`;
        }
        
        // Fallback response
        return "I don't have specific information about that, but I'd be happy to connect you with a Perceptra team member who can help answer your question in detail.";
    }
} 