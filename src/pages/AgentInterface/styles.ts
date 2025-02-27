import styled from 'styled-components';

export const AgentInterfaceContainer = styled.div`
  padding: 2rem 0;
`;

export const StyledHeading = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
`;

export const ChatContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1rem;
`;

export const MessageList = styled.div`
  height: 60vh;
  overflow-y: auto;
  padding: 1rem;
`;

export const UserMessage = styled.div`
  background: #e6f7ff;
  padding: 1rem;
  border-radius: 8px;
  margin: 0.5rem 0;
  max-width: 80%;
  margin-left: auto;
`;

export const AgentMessage = styled.div`
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 8px;
  margin: 0.5rem 0;
  max-width: 80%;
`;

export const InputContainer = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-top: 1px solid #eee;
`; 