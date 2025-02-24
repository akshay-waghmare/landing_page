import { TFunction } from "react-i18next";

interface ButtonType {
  title: string;
  link?: string;
  color?: string;
}

interface StepType {
  number: string;
  title: string;
  description: string;
  icon: string;
}

interface VisualType {
  mainImage: string;
  animation: string;
}

export interface ContentBlockProps {
  icon: string;
  title: string;
  content: string;
  section?: any[];
  button?: ButtonType | ButtonType[];
  id: string;
  direction: "left" | "right";
  steps?: StepType[];
  visual?: VisualType;
  t?: TFunction;
}
