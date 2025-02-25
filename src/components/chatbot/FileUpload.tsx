import React, { useCallback } from 'react';
import { RAGChain } from '../../lib/rag/ragChain';
import { processFile } from '../../lib/rag/documentLoader';
import './FileUpload.css';

interface FileUploadProps {
    ragChain: RAGChain | null;
    onUploadComplete: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ ragChain, onUploadComplete }) => {
    const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !ragChain) return;

        try {
            await processFile(file, ragChain);
            onUploadComplete();
            // Reset the input
            event.target.value = '';
        } catch (error) {
            console.error('Error processing file:', error);
            alert('Failed to process the file. Please try again.');
        }
    }, [ragChain, onUploadComplete]);

    return (
        <div className="file-upload">
            <input
                type="file"
                accept=".txt,.md,.doc,.docx"
                onChange={handleFileUpload}
                disabled={!ragChain}
            />
        </div>
    );
};

export default FileUpload; 