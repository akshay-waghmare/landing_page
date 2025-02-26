import React, { useEffect, useState } from 'react';
import Chatbot from './components/chatbot/Chatbot';
import './styles/App.css'; // Make sure to import any global styles

const App: React.FC = () => {
    // Get API key from environment variables or use a placeholder for demo
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY || 'demo-mode';
    const [isLoaded, setIsLoaded] = useState(false);
    
    // Log to verify the API key is available
    useEffect(() => {
        if (!process.env.REACT_APP_OPENAI_API_KEY) {
            console.warn('OpenAI API key is missing. Chatbot will run in demo mode with limited functionality.');
        } else {
            console.log('OpenAI API key is available for the chatbot.');
        }
        
        // Set loaded state after a short delay to ensure all components are ready
        setTimeout(() => {
            setIsLoaded(true);
        }, 500);
    }, []);
    
    return (
        <div className="app">
            <header className="app-header">
                <h1>Welcome to Perceptra</h1>
                <p>Your AI-powered intelligent assistant</p>
            </header>
            
            <main className="app-content">
                <div className="feature-section">
                    <h2>Experience the power of AI</h2>
                    <p>Try our interactive chat assistant by clicking the chat button in the bottom right corner.</p>
                    {!process.env.REACT_APP_OPENAI_API_KEY && (
                        <div className="demo-notice">
                            <p><strong>Note:</strong> The chatbot is currently running in demo mode with limited functionality.</p>
                        </div>
                    )}
                </div>
            </main>
            
            {/* Add the Perceptra chatbot with proper API key */}
            {isLoaded && <Chatbot apiKey={apiKey} />}
        </div>
    );
};

export default App; 