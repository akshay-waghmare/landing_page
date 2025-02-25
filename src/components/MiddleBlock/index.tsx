import React from "react";
import { Row, Col } from "antd";
import { withTranslation } from "react-i18next";
import { Slide } from "react-awesome-reveal";
import { Button } from "../../common/Button";
import { MiddleBlockSection, Content, ButtonWrapper } from "./styles";
import { useHistory } from 'react-router-dom';
import { IconType } from "react-icons";
import * as Icons from "react-icons/fa";

interface MiddleBlockProps {
  title: string;
  content: string;
  button?: string;
  buttonLink?: string;
  icon?: string;
  t: any;
  id?: string;
}

const MiddleBlock = ({ title, content, button, buttonLink, icon, t, id }: MiddleBlockProps) => {
  const history = useHistory();
  
  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  const IconComponent = icon ? (Icons[icon as keyof typeof Icons] as React.ComponentType<{ size: number }>) : null;
  
  return (
    <MiddleBlockSection id={id}>
      <Slide direction="up" triggerOnce>
        <Row justify="center" align="middle">
          <Col lg={24} md={24} sm={24} xs={24}>
            {IconComponent && <IconComponent size={50} />}
            <h6>{t(title)}</h6>
            <Content>{t(content)}</Content>
            {button && (
              <ButtonWrapper>
                <Button 
                  onClick={() => buttonLink && buttonLink.startsWith('#') ? scrollTo(buttonLink.substring(1)) : null}
                  color="#007bff"
                >
                  {t(button)}
                </Button>
              </ButtonWrapper>
            )}
          </Col>
        </Row>
      </Slide>
    </MiddleBlockSection>
  );
};

export default withTranslation()(MiddleBlock);
