import React, { useEffect, useState } from 'react';
import { Widget, addResponseMessage, addUserMessage } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';
import './Chatbot.css';
import { RAGChain } from '../../lib/rag/ragChain';

interface ChatbotProps {
    apiKey: string;
}

const Chatbot: React.FC<ChatbotProps> = ({ apiKey }) => {
    const [ragChain, setRagChain] = useState<RAGChain | null>(null);

    useEffect(() => {
        if (apiKey) {
            const chain = new RAGChain(apiKey);
            setRagChain(chain);
            addResponseMessage("Hello! I'm your AI assistant. How can I help you today?");
        }
    }, [apiKey]);

    const handleNewUserMessage = async (newMessage: string) => {
        if (!ragChain) {
            addResponseMessage("Sorry, I'm not properly initialized yet. Please try again in a moment.");
            return;
        }

        try {
            const response = await ragChain.query(newMessage);
            addResponseMessage(response);
        } catch (error) {
            console.error('Error processing message:', error);
            addResponseMessage("Sorry, I encountered an error while processing your message.");
        }
    };

    return (
        <div className="chatbot-container">
            <Widget
                handleNewUserMessage={handleNewUserMessage}
                title="AI Assistant"
                subtitle="Ask me anything!"
            />
        </div>
    );
};

export default Chatbot; 