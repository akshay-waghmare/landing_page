import { OpenAI } from '@langchain/openai';
import { RunnableSequence } from '@langchain/core/runnables';
import { MemoryVectorStore } from "@langchain/community/vectorstores/memory";
import { OpenAIEmbeddings } from '@langchain/openai';
import { Document } from '@langchain/core/documents';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { ChatPromptTemplate } from '@langchain/core/prompts';

export class RAGChain {
    private vectorStore: MemoryVectorStore;
    private model: OpenAI;
    private chain: RunnableSequence;

    constructor(apiKey: string) {
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
                    const relevantDocs = await this.vectorStore.similaritySearch(input.question, 3);
                    return relevantDocs.map((doc: Document) => doc.pageContent).join('\n');
                },
                question: (input: { question: string }) => input.question,
            },
            prompt,
            this.model,
            new StringOutputParser(),
        ]);
    }

    async addDocuments(documents: string[]) {
        const docs = documents.map(
            (pageContent) => new Document({ pageContent })
        );
        await this.vectorStore.addDocuments(docs);
    }

    async query(question: string): Promise<string> {
        try {
            const response = await this.chain.invoke({
                question: question,
            });
            return response;
        } catch (error) {
            console.error('Error in RAG query:', error);
            return 'Sorry, I encountered an error while processing your question.';
        }
    }
} 