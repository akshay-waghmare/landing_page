import { RAGChain } from './ragChain';

export async function loadAndProcessDocument(
    ragChain: RAGChain,
    text: string,
    chunkSize: number = 1000,
    overlap: number = 200
): Promise<void> {
    // Split the text into chunks
    const chunks: string[] = [];
    let startIndex = 0;

    while (startIndex < text.length) {
        const endIndex = Math.min(startIndex + chunkSize, text.length);
        const chunk = text.slice(startIndex, endIndex);
        chunks.push(chunk);
        startIndex = endIndex - overlap;
    }

    // Add chunks to the RAG chain
    await ragChain.addDocuments(chunks);
}

export async function processFile(file: File, ragChain: RAGChain): Promise<void> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = async (event) => {
            try {
                const text = event.target?.result as string;
                await loadAndProcessDocument(ragChain, text);
                resolve();
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = () => {
            reject(new Error('Failed to read file'));
        };

        reader.readAsText(file);
    });
} 