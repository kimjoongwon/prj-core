import { ButtonProps, ModalProps } from '@nextui-org/react';
import React from 'react';

export interface ModalProviderProps {
  children: React.ReactNode;
}

export interface CoCModalProps
  extends Omit<ModalProps, 'content' | 'children'> {
  isOpen: boolean;
  header: React.ReactNode | string;
  content: React.ReactNode | string;
  buttons?: ButtonProps[];
  open: () => void;
  close: () => void;
}
