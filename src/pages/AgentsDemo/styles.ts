import styled from 'styled-components';

export const AgentsDemoContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2.5rem 0;
`;

export const StyledSection = styled.section`
  position: relative;
  padding: 2rem 0;
`;

export const StyledHeading = styled.h1`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 3rem;
  color: ${props => props.theme.colors?.textPrimary || '#000'};
`;

export const DemoWrapper = styled.div`
  padding: 2rem;
  background: ${props => props.theme.colors?.background || '#fff'};
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

export const AgentCard = styled.div`
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  h2 {
    color: ${props => props.theme.colors?.textPrimary || '#000'};
    margin-bottom: 1.5rem;
  }

  button {
    margin-top: 1.5rem;
  }
`;

export const AgentDescription = styled.div`
  color: ${props => props.theme.colors?.textSecondary || '#666'};
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;

  ul {
    margin-top: 1rem;
    padding-left: 1.5rem;

    li {
      margin-bottom: 0.5rem;
    }
  }
`; 