import { Row, Col } from "antd";
import { withTranslation, TFunction } from "react-i18next";
import { Fade } from "react-awesome-reveal";
import { Link } from "react-router-dom";
import Container from "../../common/Container";
import { 
  BlogContainer, 
  BlogHeader,
  BlogTitle,
  BlogSubtitle,
  BlogGrid,
  BlogCard,
  BlogImage,
  BlogContent,
  BlogCardTitle,
  BlogCardMeta,
  BlogCardExcerpt,
  BlogCardLink
} from "./styles";

// Blog article data with SEO-optimized content
const blogArticles = [
  {
    id: 1,
    title: "How AI is Transforming Business Operations in 2023",
    excerpt: "Discover how artificial intelligence is revolutionizing business processes, improving efficiency, and creating new opportunities for companies of all sizes.",
    image: "https://images.unsplash.com/photo-1677442135136-760c813a7942?q=80&w=800&auto=format&fit=crop",
    readTime: "8 min read",
    slug: "ai-transforming-business-operations"
  },
  {
    id: 2,
    title: "The Complete Guide to Natural Language Processing for Businesses",
    excerpt: "Learn how NLP technology is changing customer service, content analysis, and business intelligence. Implement these strategies to stay ahead of the competition.",
    image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=80&w=800&auto=format&fit=crop",
    readTime: "6 min read",
    slug: "complete-guide-nlp-businesses"
  },
  {
    id: 3,
    title: "Ethical AI Development: Best Practices for Responsible Innovation",
    excerpt: "Explore the ethical considerations in AI development and learn how to implement responsible AI practices that build trust with customers and stakeholders.",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop",
    readTime: "10 min read",
    slug: "ethical-ai-development-best-practices"
  },
  {
    id: 4,
    title: "Computer Vision Applications That Are Revolutionizing Healthcare",
    excerpt: "Explore how computer vision AI is transforming medical diagnostics, patient care, and healthcare operations, with real-world examples and future trends.",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800&auto=format&fit=crop",
    readTime: "7 min read",
    slug: "computer-vision-revolutionizing-healthcare"
  },
  {
    id: 5,
    title: "Predictive Analytics: How to Implement Data-Driven Decision Making",
    excerpt: "Master the fundamentals of predictive analytics and learn how to implement data-driven decision making in your organization for better business outcomes.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
    readTime: "9 min read",
    slug: "predictive-analytics-data-driven-decision-making"
  }
];

const Blog = ({ t }: { t: TFunction }) => {
  return (
    <BlogContainer>
      <BlogHeader>
        <Container>
          <Row justify="center" align="middle">
            <Col lg={16} md={20} sm={24} xs={24}>
              <Fade direction="up">
                <BlogTitle>{t("Perceptaa Blog")}</BlogTitle>
                <BlogSubtitle>
                  {t("Expert insights on artificial intelligence, machine learning, and innovative technology solutions for business growth")}
                </BlogSubtitle>
              </Fade>
            </Col>
          </Row>
        </Container>
      </BlogHeader>

      <Container>
        <BlogGrid>
          {blogArticles.map((article) => (
            <Fade key={article.id} direction="up" triggerOnce>
              <BlogCard>
                <BlogImage src={article.image} alt={article.title} />
                <BlogContent>
                  <BlogCardTitle>{article.title}</BlogCardTitle>
                  <BlogCardMeta>
                    <span>{article.readTime}</span>
                  </BlogCardMeta>
                  <BlogCardExcerpt>{article.excerpt}</BlogCardExcerpt>
                  <BlogCardLink to={`/blog/${article.slug}`}>
                    {t("Read More")} →
                  </BlogCardLink>
                </BlogContent>
              </BlogCard>
            </Fade>
          ))}
        </BlogGrid>
      </Container>
    </BlogContainer>
  );
};

export default withTranslation()(Blog); 