import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, Input, Button, Card, List, Spin } from 'antd';
import { withTranslation } from 'react-i18next';
import { Fade } from 'react-awesome-reveal';
import Container from '../../common/Container';
import { BaseMessage } from '@langchain/core/messages';
import {
  AgentInterfaceContainer,
  StyledHeading,
  ChatContainer,
  MessageList,
  UserMessage,
  AgentMessage,
  InputContainer
} from './styles';
import { RealEstateAgent, MedicalClinicAgent } from '../../agents';

// Types for our messages and state
interface Message {
  role: 'user' | 'agent';
  content: string;
  timestamp: Date;
}

interface AgentState {
  messages: BaseMessage[];
  context: any;
  current_task: string | null;
  memory: any[];
  workflow_state: string;
  tools_output: any[];
}

const AgentInterface = () => {
  const { agentType } = useParams<{ agentType: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const agentRef = useRef<RealEstateAgent | MedicalClinicAgent | null>(null);
  const [agentState, setAgentState] = useState<AgentState>({
    messages: [],
    context: {},
    current_task: null,
    memory: [],
    workflow_state: 'initial',
    tools_output: []
  });

  // Initialize agent based on type
  useEffect(() => {
    switch (agentType?.toLowerCase()) {
      case 'realestate':
        agentRef.current = new RealEstateAgent();
        break;
      case 'medicalclinic':
        agentRef.current = new MedicalClinicAgent();
        break;
    }
    const welcomeMessage = getWelcomeMessage(agentType);
    setMessages([
      {
        role: 'agent',
        content: welcomeMessage,
        timestamp: new Date()
      }
    ]);
  }, [agentType]);

  const getWelcomeMessage = (type: string): string => {
    switch (type.toLowerCase()) {
      case 'realestate':
        return "Hello! I'm your AI real estate assistant. I can help you find properties, analyze market trends, and answer questions about real estate. How can I assist you today?";
      case 'medicalclinic':
        return "Welcome! I'm your medical clinic assistant. I can help you with appointment information, medical services, and general clinic queries. How may I help you?";
      default:
        return "Hello! How can I assist you today?";
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await processMessage(userMessage, agentType, agentState);
      
      setMessages(prev => [...prev, {
        role: 'agent',
        content: response.message,
        timestamp: new Date()
      }]);

      setAgentState(response.newState);
    } catch (error) {
      console.error('Error processing message:', error);
      setMessages(prev => [...prev, {
        role: 'agent',
        content: 'I apologize, but I encountered an error processing your request. Please try again.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const processMessage = async (
    message: Message,
    agentType: string,
    currentState: AgentState
  ): Promise<{ message: string; newState: AgentState }> => {
    if (!agentRef.current) {
      throw new Error('Agent not initialized');
    }

    const response = await agentRef.current.processMessage(message.content, currentState);
    return response;
  };

  return (
    <AgentInterfaceContainer>
      <Container>
        <Row justify="center" align="middle">
          <Col lg={24} md={24} sm={24} xs={24}>
            <Fade direction="down">
              <StyledHeading>
                {agentType === 'realestate' ? 'Real Estate Assistant' : 'Medical Clinic Assistant'}
              </StyledHeading>
              
              <ChatContainer>
                <MessageList>
                  {messages.map((message, index) => (
                    message.role === 'user' ? (
                      <UserMessage key={index}>
                        {message.content}
                      </UserMessage>
                    ) : (
                      <AgentMessage key={index}>
                        {message.content}
                      </AgentMessage>
                    )
                  ))}
                  {isLoading && (
                    <AgentMessage>
                      <Spin size="small" /> Thinking...
                    </AgentMessage>
                  )}
                </MessageList>

                <InputContainer>
                  <Input.TextArea
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    placeholder="Type your message here..."
                    autoSize={{ minRows: 2, maxRows: 6 }}
                    onPressEnter={e => {
                      if (!e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button
                    type="primary"
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputText.trim()}
                  >
                    Send
                  </Button>
                </InputContainer>
              </ChatContainer>
            </Fade>
          </Col>
        </Row>
      </Container>
    </AgentInterfaceContainer>
  );
};

export default withTranslation()(AgentInterface); 