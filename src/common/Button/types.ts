import React from 'react';

export interface ButtonProps {
  name?: string;
  color?: string;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}