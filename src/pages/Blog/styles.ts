import styled from "styled-components";
import { Link } from "react-router-dom";

export const BlogContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
`;

export const BlogHeader = styled.div`
  padding: 8rem 0 4rem;
  background-color: #f8f9fa;
  text-align: center;
  
  @media only screen and (max-width: 768px) {
    padding: 6rem 0 3rem;
  }
`;

export const BlogTitle = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  color: #18216d;
  margin-bottom: 1rem;
  
  @media only screen and (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

export const BlogSubtitle = styled.p`
  font-size: 1.25rem;
  color: #555;
  max-width: 800px;
  margin: 0 auto;
  
  @media only screen and (max-width: 768px) {
    font-size: 1.125rem;
  }
`;

export const BlogGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2.5rem;
  padding: 5rem 0;
  
  @media only screen and (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 3rem 0;
  }
`;

export const BlogCard = styled.article`
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
`;

export const BlogImage = styled.img`
  width: 100%;
  height: 220px;
  object-fit: cover;
`;

export const BlogContent = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

export const BlogCardTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #18216d;
  margin-bottom: 0.75rem;
  line-height: 1.3;
`;

export const BlogCardMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: #777;
`;

export const BlogCardExcerpt = styled.p`
  font-size: 1rem;
  color: #555;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  flex-grow: 1;
`;

export const BlogCardLink = styled(Link)`
  font-size: 1rem;
  font-weight: 500;
  color: #ff825c;
  text-decoration: none;
  align-self: flex-start;
  
  &:hover {
    text-decoration: underline;
  }
`; 