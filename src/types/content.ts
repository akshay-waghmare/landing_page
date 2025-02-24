export interface ButtonType {
  title: string;
  link?: string;
  color?: string;
}

export interface StepType {
  number: string;
  title: string;
  description: string;
  icon: string;
}

export interface VisualType {
  mainImage: string;
  animation: string;
}

export interface MissionContentType {
  title: string;
  text: string;
  steps: StepType[];
  visual: VisualType;
  button: ButtonType;
}

export interface IntroContentType {
  title: string;
  text: string;
  benefits: string[];
  button: ButtonType[];
}

export interface AboutSectionType {
  title: string;
  content: string;
  icon: string;
}

export interface AboutContentType {
  title: string;
  text: string;
  section: AboutSectionType[];
  button: ButtonType;
}

export interface ProductContentType {
  title: string;
  text: string;
  section: AboutSectionType[];
  button: ButtonType;
  secondaryButton: ButtonType;
}
