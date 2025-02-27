import styled from "styled-components";

export const AboutContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 100%;
`;

export const StyledSection = styled.section`
  position: relative;
  padding: 7.5rem 0 3rem;
  
  @media only screen and (max-width: 1024px) {
    padding: 4rem 0 2rem;
  }
`;

export const ContentWrapper = styled.div`
  position: relative;
  max-width: 100%;
`;

export const Content = styled.div`
  margin: 1.5rem 0 2rem 0;
`;

export const StyledHeading = styled.h2`
  text-align: left;
  font-size: 2.5rem;
  font-weight: 600;
  color: #18216d;
  
  @media only screen and (max-width: 768px) {
    font-size: 2rem;
  }
`;

export const StyledParagraph = styled.p`
  font-size: 1.125rem;
  color: #333;
  line-height: 1.75;
  margin-bottom: 1.5rem;
  
  a {
    color: #ff825c;
    text-decoration: none;
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  strong {
    font-weight: 600;
    color: #18216d;
  }
`;

export const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
  
  @media only screen and (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const TeamMemberCard = styled.div`
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
  
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #18216d;
    margin-bottom: 0.5rem;
  }
  
  p {
    font-size: 1rem;
    color: #555;
    margin-bottom: 0.5rem;
    
    &:last-child {
      font-size: 0.875rem;
      color: #777;
      font-style: italic;
    }
  }
`; 