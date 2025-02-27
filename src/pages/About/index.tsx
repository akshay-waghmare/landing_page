import { Row, Col } from "antd";
import { withTranslation, TFunction } from "react-i18next";
import { Fade } from "react-awesome-reveal";
import { SvgIcon } from "../../common/SvgIcon";
import Container from "../../common/Container";
import { 
  AboutContainer, 
  Content, 
  ContentWrapper, 
  StyledHeading, 
  StyledParagraph,
  StyledSection,
  TeamMemberCard,
  TeamGrid
} from "../../pages/About/styles";

const About = ({ t }: { t: TFunction }) => {
  return (
    <AboutContainer>
      <StyledSection>
        <Container>
          <Row justify="center" align="middle">
            <ContentWrapper>
              <Col lg={24} md={24} sm={24} xs={24}>
                <Fade direction="left">
                  <StyledHeading>About Perceptaa</StyledHeading>
                  <Content>
                    <StyledParagraph>
                      Perceptaa is a pioneering AI solutions company dedicated to transforming how businesses interact with technology. Founded in 2021, we specialize in developing cutting-edge artificial intelligence solutions that help organizations streamline operations, enhance customer experiences, and drive innovation.
                    </StyledParagraph>
                    
                    <StyledParagraph>
                      Our mission is to make advanced AI technology accessible and practical for businesses of all sizes. We believe that AI should be a tool that empowers human potential rather than replacing it, and we design our solutions with this philosophy at their core.
                    </StyledParagraph>
                  </Content>
                </Fade>
              </Col>
            </ContentWrapper>
          </Row>
        </Container>
      </StyledSection>

      <StyledSection>
        <Container>
          <Row justify="center" align="middle">
            <ContentWrapper>
              <Col lg={24} md={24} sm={24} xs={24}>
                <Fade direction="right">
                  <StyledHeading>Our Expertise</StyledHeading>
                  <Content>
                    <StyledParagraph>
                      At Perceptaa, we excel in several key areas of artificial intelligence:
                    </StyledParagraph>
                    
                    <ul>
                      <li>
                        <StyledParagraph><strong>Natural Language Processing:</strong> Building systems that understand and generate human language, powering chatbots, content analysis, and automated documentation.</StyledParagraph>
                      </li>
                      <li>
                        <StyledParagraph><strong>Computer Vision:</strong> Developing solutions that can interpret and analyze visual information from the world, enabling applications in security, quality control, and augmented reality.</StyledParagraph>
                      </li>
                      <li>
                        <StyledParagraph><strong>Predictive Analytics:</strong> Creating models that identify patterns in data to forecast trends and behaviors, helping businesses make proactive decisions.</StyledParagraph>
                      </li>
                      <li>
                        <StyledParagraph><strong>Custom AI Solutions:</strong> Designing bespoke AI systems tailored to specific business challenges and opportunities.</StyledParagraph>
                      </li>
                    </ul>
                  </Content>
                </Fade>
              </Col>
            </ContentWrapper>
          </Row>
        </Container>
      </StyledSection>

      <StyledSection>
        <Container>
          <Row justify="center" align="middle">
            <ContentWrapper>
              <Col lg={24} md={24} sm={24} xs={24}>
                <Fade direction="left">
                  <StyledHeading>Our Values</StyledHeading>
                  <Content>
                    <StyledParagraph>
                      Our work is guided by a set of core values that define who we are and how we operate:
                    </StyledParagraph>
                    
                    <ul>
                      <li>
                        <StyledParagraph><strong>Innovation:</strong> We constantly push the boundaries of what's possible with AI technology.</StyledParagraph>
                      </li>
                      <li>
                        <StyledParagraph><strong>Integrity:</strong> We are committed to ethical AI development and transparent business practices.</StyledParagraph>
                      </li>
                      <li>
                        <StyledParagraph><strong>Collaboration:</strong> We work closely with our clients to ensure our solutions address their specific needs.</StyledParagraph>
                      </li>
                      <li>
                        <StyledParagraph><strong>Excellence:</strong> We strive for the highest quality in everything we do.</StyledParagraph>
                      </li>
                    </ul>
                  </Content>
                </Fade>
              </Col>
            </ContentWrapper>
          </Row>
        </Container>
      </StyledSection>

      <StyledSection>
        <Container>
          <Row justify="center" align="middle">
            <ContentWrapper>
              <Col lg={24} md={24} sm={24} xs={24}>
                <Fade direction="right">
                  <StyledHeading>Our Team</StyledHeading>
                  <Content>
                    <StyledParagraph>
                      Perceptaa is powered by a diverse team of AI researchers, software engineers, data scientists, and business strategists. Our combined expertise allows us to approach problems from multiple angles and develop holistic solutions.
                    </StyledParagraph>
                    
                    <TeamGrid>
                      <TeamMemberCard>
                        <h3>Dr. Aisha Patel</h3>
                        <p>Founder & CEO</p>
                        <p>Ph.D. in Machine Learning from MIT</p>
                      </TeamMemberCard>
                      
                      <TeamMemberCard>
                        <h3>Michael Chen</h3>
                        <p>Chief Technology Officer</p>
                        <p>Former Lead AI Researcher at Google</p>
                      </TeamMemberCard>
                      
                      <TeamMemberCard>
                        <h3>Sofia Rodriguez</h3>
                        <p>Head of Product</p>
                        <p>15+ years experience in tech product management</p>
                      </TeamMemberCard>
                    </TeamGrid>
                  </Content>
                </Fade>
              </Col>
            </ContentWrapper>
          </Row>
        </Container>
      </StyledSection>

      <StyledSection>
        <Container>
          <Row justify="center" align="middle">
            <ContentWrapper>
              <Col lg={24} md={24} sm={24} xs={24}>
                <Fade direction="up">
                  <StyledHeading>Contact Us</StyledHeading>
                  <Content>
                    <StyledParagraph>
                      Interested in learning more about how Perceptaa can help your business leverage the power of AI? We'd love to hear from you.
                    </StyledParagraph>
                    
                    <StyledParagraph>
                      Email us at <a href="mailto:info@perceptaa.com">info@perceptaa.com</a> or call us at +1 (555) 123-4567.
                    </StyledParagraph>
                    
                    <StyledParagraph>
                      Our headquarters are located in Pune, Maharashtra, India, with additional offices in San Francisco and London.
                    </StyledParagraph>
                  </Content>
                </Fade>
              </Col>
            </ContentWrapper>
          </Row>
        </Container>
      </StyledSection>
    </AboutContainer>
  );
};

export default withTranslation()(About); 