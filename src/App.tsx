import React from 'react';
import Chatbot from './components/chatbot/Chatbot';

const App: React.FC = () => {
    return (
        <div className="app">
            {/* Your existing app content */}
            
            {/* Add the chatbot */}
            <Chatbot apiKey={process.env.OPENAI_API_KEY || ''} />
        </div>
    );
};

export default App; 