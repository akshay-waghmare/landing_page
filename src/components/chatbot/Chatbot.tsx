import React, { useEffect, useState, useRef, KeyboardEvent } from 'react';
import { Widget, addResponseMessage, addUserMessage } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';
import './Chatbot.css';
import { RAGChain } from '../../lib/rag/ragChain';

interface ChatbotProps {
    apiKey: string;
}

interface Message {
    text: string;
    isUser: boolean;
    timestamp: Date;
}

const Chatbot: React.FC<ChatbotProps> = ({ apiKey }) => {
    const [ragChain, setRagChain] = useState<RAGChain | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [showDocumentInput, setShowDocumentInput] = useState(false);
    const [documentText, setDocumentText] = useState('');
    const [showFileUpload, setShowFileUpload] = useState(false);
    const chatbotRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const documentInputRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    console.log('Chatbot component rendering');

    // Initialize the RAG chain when the component mounts
    useEffect(() => {
        const initializeRagChain = async () => {
            try {
                // Create a new RAGChain instance
                const chain = new RAGChain(apiKey);
                setRagChain(chain);
                
                // Add Perceptraa documentation content
                await addPerceptraaContent(chain);
                
                // Set initialized state
                setIsInitialized(true);
                
                // Welcome message
                setMessages([{
                    text: "Hello! I'm your Perceptra AI assistant. I can answer questions about our AI solutions, technology, and business benefits. How can I help you today?",
                    isUser: false,
                    timestamp: new Date()
                }]);
            } catch (error) {
                console.error('Error initializing RAG chain:', error);
                // Even if there's an error, we'll set initialized to true and show an error message
                setIsInitialized(true);
                setMessages([{
                    text: "I'm having trouble connecting to my knowledge base. I'll do my best to help with basic questions.",
                    isUser: false,
                    timestamp: new Date()
                }]);
            }
        };
        
        initializeRagChain();
    }, [apiKey]);

    // Scroll to bottom of messages when new messages are added
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Focus on input when chat is opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    }, [isOpen]);

    const handleNewUserMessage = async (newMessage: string) => {
        if (!isInitialized) {
            addMessage("I'm still initializing. Please try again in a moment.", false);
            return;
        }

        try {
            setIsTyping(true);
            
            if (ragChain) {
                const response = await ragChain.query(newMessage);
                addMessage(response, false);
            } else {
                // Fallback response if ragChain is not available
                addMessage("I'm having trouble accessing my knowledge base. Please try again later or contact support.", false);
            }
        } catch (error) {
            console.error('Error processing message:', error);
            addMessage("Sorry, I encountered an error while processing your message.", false);
        } finally {
            setIsTyping(false);
        }
    };

    const addMessage = (text: string, isUser: boolean) => {
        setMessages(prev => [...prev, {
            text,
            isUser,
            timestamp: new Date()
        }]);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleInputKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            handleSendMessage();
        }
    };

    const handleSendMessage = () => {
        if (inputValue.trim()) {
            // Add the user message
            addMessage(inputValue.trim(), true);
            
            // Process the message
            handleNewUserMessage(inputValue.trim());
            
            // Clear the input
            setInputValue('');
            
            // Focus back on the input
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }
    };

    const handleDocumentInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDocumentText(e.target.value);
    };

    const handleAddDocument = async () => {
        if (documentText.trim()) {
            const success = await addCustomDocument(documentText.trim());
            if (success) {
                setDocumentText('');
                setShowDocumentInput(false);
            }
        }
    };

    const toggleChat = () => {
        console.log('Toggle chat called, current state:', isOpen);
        setIsOpen(!isOpen);
    };

    const toggleDocumentInput = () => {
        setShowDocumentInput(!showDocumentInput);
        setShowFileUpload(false);
        // Focus on the document input when it's shown
        if (!showDocumentInput) {
            setTimeout(() => {
                documentInputRef.current?.focus();
            }, 100);
        }
    };

    const toggleFileUpload = () => {
        setShowFileUpload(!showFileUpload);
        setShowDocumentInput(false);
        // Trigger file input click when shown
        if (!showFileUpload && fileInputRef.current) {
            setTimeout(() => {
                fileInputRef.current?.click();
            }, 100);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const text = await file.text();
            
            // Process the markdown file - split into paragraphs
            const paragraphs = text.split('\n\n')
                .filter(p => p.trim().length > 0)
                .map(p => p.trim());
            
            if (paragraphs.length > 0 && ragChain) {
                setIsTyping(true);
                await ragChain.addDocuments(paragraphs);
                setIsTyping(false);
                
                addMessage(`I've processed the file "${file.name}" and added ${paragraphs.length} documents to my knowledge base. I can now answer questions about this content.`, false);
                setShowFileUpload(false);
                
                // Clear the file input
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }
        } catch (error) {
            console.error('Error processing file:', error);
            addMessage("Sorry, I encountered an error while processing your file.", false);
        }
    };

    // Format timestamp
    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Add this method to the Chatbot component
    const addCustomDocument = async (document: string) => {
        if (ragChain) {
            try {
                await ragChain.addDocuments([document]);
                addMessage("I've learned new information that I can use to answer your questions.", false);
                return true;
            } catch (error) {
                console.error('Error adding document:', error);
                return false;
            }
        }
        return false;
    };

    // Function to add Perceptraa content from the markdown file
    const addPerceptraaContent = async (chain: RAGChain) => {
        // This is the content from perceptraa.md, chunked into smaller documents for better retrieval
        const perceptraaContent = [
            // Core Technological Focus - AI
            "Artificial Intelligence forms the foundation of Perceptra's solutions by employing sophisticated algorithms and deep learning models to interpret and analyze vast data streams in real time.",
            "Advanced Natural Language Processing (NLP): The AI component interprets literal text and engages in perceptual analysis—recognizing contextual cues and subtle language patterns. This enhanced perception allows the system to grasp nuanced queries and emotional undercurrents, enabling more accurate and empathetic responses.",
            "Emotional Intelligence and Adaptation: Beyond data analysis, the AI is designed to sense emotional cues from users. By detecting sentiment through tone, word choice, and context, the system tailors its responses to align with the user's emotional state, fostering a more engaging and supportive interaction.",
            "Iterative Clarification and Learning: Incorporating reiteration, the system employs iterative feedback loops to confirm understanding. This process allows it to rephrase or expand on information when needed, ensuring clarity and building user confidence in the interaction.",
            "Data-Driven Decision Making: Combining perceptual insights with quantitative data, the AI continually refines its models. This holistic approach ensures that decisions are informed by both factual trends and emotional context, driving smarter business strategies.",
            
            // Chatbots
            "Chatbots serve as the primary interface for user interactions, blending natural conversation with advanced perceptual and emotional capabilities.",
            "User Engagement: Designed with conversational intelligence, chatbots now incorporate perception to detect context and emotional state in user queries. This enables them to adjust tone and style dynamically, ensuring that responses resonate on both an informational and emotional level.",
            "Multichannel Support: Chatbots can be deployed across various platforms, maintaining consistency in perceptual and emotional cues. Whether on websites, mobile apps, or social media, they leverage reiteration techniques to ensure that users fully understand key messages.",
            "24/7 Availability: By operating around the clock, the system is always ready to perceive subtle shifts in conversation and respond empathetically. The ability to iterate on responses in real time means that users receive clear, tailored assistance at any hour.",
            "Personalization Through Emotion and Feedback: Integration with user data allows the chatbot to not only recall historical interactions but also adjust responses based on real-time emotional cues.",
            
            // RAG
            "Retrieval-Augmented Generation (RAG) combines generative language models with robust information retrieval, enhanced by perceptual and emotional dimensions.",
            "Enhanced Response Accuracy: RAG enables the system to fetch contextually relevant documents and other resources, integrating them with generative outputs. With added perceptual capabilities, the retrieval process better understands the subtleties of user queries.",
            "Dynamic Content Integration: The system factors in user sentiment when retrieving information. This emotional awareness, coupled with reiteration processes, ensures that responses are both current and empathetically tailored—providing a richer, multi-dimensional answer.",
            "Contextual Relevance Through Iterative Refinement: The retrieval module employs reiteration by cross-referencing initial responses with follow-up queries or clarifications.",
            
            // Agentic Systems
            "Agentic systems provide the capacity for autonomous action, incorporating the ability to perceive operational context, respond to emotional feedback, and iterate actions as needed.",
            "Automated Task Execution: These systems can automatically trigger actions such as scheduling appointments or updating CRM records. By integrating perceptual insights, they detect the optimal timing and context for executing these tasks.",
            "Seamless Integration with Feedback Loops: The agentic layer benefits from iterative processes that review and refine actions based on real-time user responses.",
            "Adaptive and Empathetic Automation: The combination of perceptual data and emotional intelligence allows the system to adjust its actions dynamically. If a user's sentiment indicates urgency or dissatisfaction, the system can escalate the response.",
            
            // Strategic Business Benefits
            "Enhanced Lead Generation: Perceptra's integrated system redefines lead generation by combining advanced analytics with perceptual and emotional insights.",
            "Intelligent Qualification: By analyzing factual data and emotional tone within user interactions, the system accurately identifies high-potential leads. Iterative clarification mechanisms further refine lead profiles.",
            "Personalized Engagement: The incorporation of emotional intelligence enables the system to craft messages that resonate on a personal level, increasing engagement.",
            "Reduced Operator Overload: Operational efficiency is enhanced as the system leverages advanced automation with integrated perception, emotion, and reiteration.",
            "Streamlined Customer Support: Routine queries are managed autonomously, with the chatbot perceiving user frustration or confusion and reiterating solutions until clarity is achieved.",
            "Cost Efficiency: Cost savings emerge naturally from the improved efficiency and smarter resource management enabled by these integrated capabilities.",
            "Reduced Labor Costs: Automating routine tasks through perceptual, emotional, and iterative processing minimizes the need for additional support staff.",
            
            // Value Proposition
            "Integration with Existing Toolkits: Perceptra's solutions are designed to complement and enhance current systems, with the added benefits of perceptual, emotional, and iterative intelligence.",
            "Seamless Adoption: The system integrates smoothly with legacy infrastructures while introducing advanced perceptual and emotional analytics.",
            "Modular Architecture and Flexibility: Its modular design includes components that capture environmental and user-specific perceptual data, analyze emotional cues, and iteratively refine responses.",
            "Scalability and Adaptability: In an ever-changing digital landscape, Perceptra's solution is built to evolve alongside business needs by incorporating dynamic perceptual and emotional feedback.",
            "Future-Proof Architecture: The system is engineered to handle growing data volumes and increasingly complex queries without compromising performance.",
            "Adaptive Learning and Iterative Improvement: Continuous learning is at the heart of the system. By integrating feedback loops that emphasize reiteration, the solution refines its responses.",
            "Actionable Insights and Automation: Beyond immediate interactions, Perceptra's integrated approach delivers deep business intelligence and robust automation that is sensitive to both context and emotion.",
            "Real-Time Analytics with Emotional Context: The system continuously monitors interactions, gathering data on both user sentiment and conversational context.",
            "Enhanced Reporting and Clarity: Detailed analytics report on system performance, customer satisfaction, and operational efficiency while incorporating perceptual and emotional data."
        ];
        
        // Add the content to the RAG chain
        await chain.addDocuments(perceptraaContent);
        console.log("Added Perceptraa content to RAG system");
    };

    // You can call this method when needed, for example:
    // addCustomDocument("Perceptra's new AI feature helps businesses automate customer support with 95% accuracy.");

    return (
        <div className="chatbot-container" ref={chatbotRef}>
            {!isOpen && (
                <button 
                    className="chat-toggle-button force-visible"
                    onClick={toggleChat}
                    aria-label="Open Perceptra chat"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 6C13.93 6 15.5 7.57 15.5 9.5C15.5 11.43 13.93 13 12 13C10.07 13 8.5 11.43 8.5 9.5C8.5 7.57 10.07 6 12 6ZM12 20C9.97 20 8.15 19.27 6.73 18.05C6.68 18.02 6.62 17.98 6.57 17.94C6.65 17.03 6.86 16.18 7.21 15.45C8.1 14.07 10.05 13 12 13C13.95 13 15.9 14.07 16.79 15.45C17.14 16.18 17.35 17.03 17.43 17.94C17.38 17.98 17.32 18.02 17.27 18.05C15.85 19.27 14.03 20 12 20Z" fill="currentColor"/>
                        <path d="M18.5 10.5C17.5 10.5 17 11 17 11H16C16 11 16.5 9.5 18.5 9.5C20.5 9.5 21 11 21 11H20C20 11 19.5 10.5 18.5 10.5Z" fill="currentColor"/>
                        <path d="M5.5 10.5C4.5 10.5 4 11 4 11H3C3 11 3.5 9.5 5.5 9.5C7.5 9.5 8 11 8 11H7C7 11 6.5 10.5 5.5 10.5Z" fill="currentColor"/>
                    </svg>
                </button>
            )}
            {isOpen && (
                <div className="perceptra-chat-window">
                    <div className="perceptra-chat-header">
                        <h3>Perceptra AI</h3>
                        <p>Your intelligent assistant</p>
                        <div className="perceptra-header-buttons">
                            <button 
                                className="perceptra-upload-file-button"
                                onClick={toggleFileUpload}
                                aria-label="Upload markdown file"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z" fill="currentColor"/>
                                </svg>
                            </button>
                            <button 
                                className="perceptra-add-document-button"
                                onClick={toggleDocumentInput}
                                aria-label={showDocumentInput ? "Cancel adding document" : "Add document to knowledge base"}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20Z" fill="currentColor"/>
                                    <path d="M12 13H14V17H12V13Z" fill="currentColor"/>
                                    <path d="M10 15H16V17H10V15Z" fill="currentColor"/>
                                </svg>
                            </button>
                            <button 
                                className="perceptra-chat-close"
                                onClick={toggleChat}
                                aria-label="Close chat"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor"/>
                                </svg>
                            </button>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="perceptra-file-input"
                            accept=".md,.txt"
                            onChange={handleFileUpload}
                            style={{ display: 'none' }}
                        />
                    </div>
                    
                    {showDocumentInput && (
                        <div className="perceptra-document-input-container">
                            <textarea
                                ref={documentInputRef}
                                className="perceptra-document-input"
                                placeholder="Enter document text to add to the knowledge base..."
                                value={documentText}
                                onChange={handleDocumentInputChange}
                                rows={4}
                            />
                            <div className="perceptra-document-buttons">
                                <button 
                                    className="perceptra-document-cancel"
                                    onClick={() => setShowDocumentInput(false)}
                                >
                                    Cancel
                                </button>
                                <button 
                                    className="perceptra-document-add"
                                    onClick={handleAddDocument}
                                    disabled={!documentText.trim()}
                                >
                                    Add to Knowledge Base
                                </button>
                            </div>
                        </div>
                    )}
                    
                    <div className="perceptra-chat-messages">
                        {messages.map((message, index) => (
                            <div 
                                key={index} 
                                className={`perceptra-message ${message.isUser ? 'perceptra-user-message' : 'perceptra-bot-message'}`}
                            >
                                <div className="perceptra-message-content">
                                    <p>{message.text}</p>
                                    <span className="perceptra-message-time">{formatTime(message.timestamp)}</span>
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="perceptra-message perceptra-bot-message">
                                <div className="perceptra-message-content">
                                    <div className="perceptra-typing-indicator">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="perceptra-chat-input-container">
                        <input
                            type="text"
                            ref={inputRef}
                            className="perceptra-chat-input"
                            placeholder="Type a message..."
                            value={inputValue}
                            onChange={handleInputChange}
                            onKeyPress={handleInputKeyPress}
                        />
                        <button 
                            className="perceptra-send-button"
                            onClick={handleSendMessage}
                            disabled={!inputValue.trim()}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="currentColor"/>
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot; 