import { lazy } from "react";
import IntroContent from "../../content/IntroContent.json";
import MiddleBlockContent from "../../content/MiddleBlockContent.json";
import AboutContent from "../../content/AboutContent.json";
import MissionContent from "../../content/MissionContent.json";
import ProductContent from "../../content/ProductContent.json";
import ContactContent from "../../content/ContactContent.json";
import { MissionContentType, IntroContentType, AboutContentType, ProductContentType } from "../../types/content";

const Contact = lazy(() => import("../../components/ContactForm"));
const MiddleBlock = lazy(() => import("../../components/MiddleBlock"));
const Container = lazy(() => import("../../common/Container"));
const ScrollToTop = lazy(() => import("../../common/ScrollToTop"));
const ContentBlock = lazy(() => import("../../components/ContentBlock"));

const typedMissionContent = MissionContent as MissionContentType;
const typedIntroContent = IntroContent as IntroContentType;
const typedAboutContent = AboutContent as AboutContentType;
const typedProductContent = ProductContent as ProductContentType;

const Home = () => {
  return (
    <Container>
      <ScrollToTop />
      <ContentBlock
        direction="right"
        title={typedIntroContent.title}
        content={typedIntroContent.text}
        button={typedIntroContent.button}
        icon="developer.svg"
        id="intro"
      />
      <MiddleBlock
        title={MiddleBlockContent.title}
        content={MiddleBlockContent.text}
        button={MiddleBlockContent.button.title} // Pass only the button title
        buttonLink={MiddleBlockContent.button.link} // Add buttonLink prop
        icon="FaReact" // Pass the icon name from react-icons
      />
      <ContentBlock
        direction="left"
        title={typedAboutContent.title}
        content={typedAboutContent.text}
        section={typedAboutContent.section}
        button={typedAboutContent.button}
        icon="graphs.svg"
        id="about"
      />
      <ContentBlock
        direction="right"
        title={typedMissionContent.title}
        content={typedMissionContent.text}
        steps={typedMissionContent.steps}
        button={typedMissionContent.button}
        visual={typedMissionContent.visual}
        icon="product-launch.svg"
        id="mission"
      />
      <ContentBlock
        direction="left"
        title={typedProductContent.title}
        content={typedProductContent.text}
        section={typedProductContent.section}
        button={[typedProductContent.button, typedProductContent.secondaryButton]}
        icon="waving.svg"
        id="product"
      />
      <Contact
        title={ContactContent.title}
        content={ContactContent.text}
        id="contact"
      />
    </Container>
  );
};

export default Home;
