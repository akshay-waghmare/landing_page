import React from 'react';
import { ButtonProps } from "./types";
import { StyledButton } from "./styles";

export const Button = ({ name, color, children, onClick, disabled }: ButtonProps) => (
  <StyledButton 
    name={name}
    color={color} 
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </StyledButton>
);
