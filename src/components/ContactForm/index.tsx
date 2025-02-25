import { Row, Col, notification } from "antd";
import { withTranslation } from "react-i18next";
import { Slide } from "react-awesome-reveal";
import { ContactProps } from "./types";
import { Button } from "../../common/Button";
import Block from "../Block";
import Input from "../../common/Input";
import TextArea from "../../common/TextArea";
import { ContactContainer, FormGroup, ButtonContainer } from "./styles";
import { useState } from "react";
import { submitLead } from "../../services/api";

const Contact = ({ title, content, id, t }: ContactProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
    company: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!form.email || !form.email.includes('@')) {
      throw new Error('Please enter a valid email address');
    }
    if (!form.company) {
      throw new Error('Company name is required');
    }
    if (!form.name) {
      throw new Error('Your name is required');
    }
    if (form.phone && !form.phone.match(/^\+?[\d\s-]+$/)) {
      throw new Error('Please enter a valid phone number');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      validateForm();

      // Format the data according to backend API expectations
      const response = await submitLead({
        company_name: form.company,
        contact_email: form.email,
        phone_number: form.phone || "",
        website: window.location.origin,
        notes: `Name: ${form.name}\nMessage: ${form.message}`.trim()
      });

      notification.success({
        message: "Success!",
        description: response.message || "Thank you! We'll contact you shortly.",
        duration: 5
      });
      setForm({ name: "", email: "", message: "", company: "", phone: "" });
    } catch (error) {
      notification.error({
        message: "Form Submission Error",
        description: error instanceof Error ? error.message : "Please try again",
        duration: 5
      });
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ContactContainer id={id}>
      <Row justify="space-between" align="middle">
        <Col lg={12} md={11} sm={24} xs={24}>
          <Slide direction="left" triggerOnce>
            <Block title={title} content={content} />
          </Slide>
        </Col>
        <Col lg={12} md={12} sm={24} xs={24}>
          <Slide direction="right" triggerOnce>
            <FormGroup autoComplete="off" onSubmit={handleSubmit}>
              <Col span={24}>
                <Input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={form.name}
                  onChange={handleChange}
                />
              </Col>
              <Col span={24}>
                <Input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={form.email}
                  onChange={handleChange}
                />
              </Col>
              <Col span={24}>
                <Input
                  type="text"
                  name="company"
                  placeholder="Your Company"
                  value={form.company}
                  onChange={handleChange}
                />
              </Col>
              <Col span={24}>
                <Input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number (optional)"
                  value={form.phone}
                  onChange={handleChange}
                />
              </Col>
              <Col span={24}>
                <TextArea
                  placeholder="Tell us about your needs"
                  value={form.message}
                  name="message"
                  onChange={handleChange}
                />
              </Col>
              <ButtonContainer>
                <Button name="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Submit"}
                </Button>
              </ButtonContainer>
            </FormGroup>
          </Slide>
        </Col>
      </Row>
    </ContactContainer>
  );
};

export default withTranslation()(Contact);
