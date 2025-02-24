import { Row, Col } from "antd";
import { Fade } from "react-awesome-reveal";
import { withTranslation } from "react-i18next";

import { ContentBlockProps } from "./types";
import { Button } from "../../common/Button";
import { SvgIcon } from "../../common/SvgIcon";
import { ButtonType } from "../../types/content"; // Add this import

import {
  ContentSection,
  Content,
  ContentWrapper,
  ServiceWrapper,
  MinTitle,
  MinPara,
  StyledRow,
  ButtonWrapper,
} from "./styles";

const ContentBlock = ({
  icon,
  title,
  content,
  section,
  button,
  id,
  direction,
  steps,
  visual,
  t,
}: ContentBlockProps & { t: any }) => {
  const scrollTo = (id: string) => {
    const element = document.getElementById(id) as HTMLDivElement;
    element.scrollIntoView({
      behavior: "smooth",
    });
  };

  const renderSteps = () => {
    if (!steps) return null;
    return (
      <ServiceWrapper>
        <Row justify="space-between">
          {steps.map((step, id) => (
            <Col key={id} span={7}>
              <SvgIcon src={step.icon} width="60px" height="60px" />
              <MinTitle>{t?.(step.title) || step.title}</MinTitle>
              <MinPara>{t?.(step.description) || step.description}</MinPara>
            </Col>
          ))}
        </Row>
      </ServiceWrapper>
    );
  };

  const renderButtons = (button: ButtonType | ButtonType[]) => {
    if (Array.isArray(button)) {
      return button.map((item, id) => (
        <Button key={id} color={item.color} onClick={() => scrollTo("about")}>
          {t?.(item.title) || item.title}
        </Button>
      ));
    }
    return (
      <Button color={button.color} onClick={() => scrollTo("about")}>
        {t?.(button.title) || button.title}
      </Button>
    );
  };

  return (
    <ContentSection>
      <Fade direction={direction} triggerOnce>
        <StyledRow
          justify="space-between"
          align="middle"
          id={id}
          direction={direction}
        >
          <Col lg={11} md={11} sm={12} xs={24}>
            {visual ? (
              <div>
                <img src={visual.mainImage} alt="main" style={{ width: '100%' }} />
                <img src={visual.animation} alt="animation" style={{ width: '100%' }} />
              </div>
            ) : (
              <SvgIcon src={icon} width="100%" height="100%" />
            )}
          </Col>
          <Col lg={11} md={11} sm={11} xs={24}>
            <ContentWrapper>
              <h6>{t?.(title) || title}</h6>
              <Content>{t?.(content) || content}</Content>
              {steps ? renderSteps() : null}
              {button && (
                <ButtonWrapper>
                  {renderButtons(button)}
                </ButtonWrapper>
              )}
              {section && (
                <ServiceWrapper>
                  <Row justify="space-between">
                    {typeof section === "object" &&
                      section.map(
                        (
                          item: {
                            title: string;
                            content: string;
                            icon: string;
                          },
                          id: number
                        ) => {
                          return (
                            <Col key={id} span={11}>
                              <SvgIcon
                                src={item.icon}
                                width="60px"
                                height="60px"
                              />
                              <MinTitle>{t(item.title)}</MinTitle>
                              <MinPara>{t(item.content)}</MinPara>
                            </Col>
                          );
                        }
                      )}
                  </Row>
                </ServiceWrapper>
              )}
            </ContentWrapper>
          </Col>
        </StyledRow>
      </Fade>
    </ContentSection>
  );
};

export default withTranslation()(ContentBlock);
