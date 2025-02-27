import React, { useState } from 'react';
import { Row, Col, Card, Button, Space } from 'antd';
import { withTranslation } from 'react-i18next';
import { Fade } from 'react-awesome-reveal';
import Container from '../../common/Container';
import {
  AgentsDemoContainer,
  StyledHeading,
  StyledSection,
  AgentCard,
  AgentDescription,
  DemoWrapper
} from './styles';

const AgentsDemo = () => {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  const handleAgentSelect = (agentType: string) => {
    setSelectedAgent(agentType);
    // We'll implement the redirection to specific agent pages later
    window.location.href = `/agents/${agentType.toLowerCase()}`;
  };

  return (
    <AgentsDemoContainer>
      <StyledSection>
        <Container>
          <Row justify="center" align="middle">
            <Col lg={24} md={24} sm={24} xs={24}>
              <Fade direction="down">
                <StyledHeading>AI Agents Demo</StyledHeading>
                <DemoWrapper>
                  <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <AgentCard>
                      <h2>Real Estate Agent</h2>
                      <AgentDescription>
                        An intelligent agent specialized in real estate queries and property information.
                        Features include:
                        <ul>
                          <li>Property search and recommendations</li>
                          <li>Market analysis and pricing insights</li>
                          <li>Property comparison and evaluation</li>
                          <li>Location-based information</li>
                        </ul>
                      </AgentDescription>
                      <Button type="primary" size="large" onClick={() => handleAgentSelect('RealEstate')}>
                        Try Real Estate Agent
                      </Button>
                    </AgentCard>

                    <AgentCard>
                      <h2>Medical Clinic Assistant</h2>
                      <AgentDescription>
                        A healthcare-focused agent for medical clinic information and assistance.
                        Features include:
                        <ul>
                          <li>Appointment scheduling assistance</li>
                          <li>Medical service information</li>
                          <li>Doctor specialization lookup</li>
                          <li>Basic medical FAQ handling</li>
                        </ul>
                      </AgentDescription>
                      <Button type="primary" size="large" onClick={() => handleAgentSelect('MedicalClinic')}>
                        Try Medical Assistant
                      </Button>
                    </AgentCard>
                  </Space>
                </DemoWrapper>
              </Fade>
            </Col>
          </Row>
        </Container>
      </StyledSection>
    </AgentsDemoContainer>
  );
};

export default withTranslation()(AgentsDemo); 