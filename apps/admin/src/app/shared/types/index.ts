import { ButtonProps, ModalProps } from '@nextui-org/react';

export interface RawItems<T> {
  data: T[];
  renderItem: (item: T) => React.ReactNode;
}

export interface ModalProviderProps {
  children: React.ReactNode;
}

export interface CoCModalProps
  extends Omit<ModalProps, 'content' | 'children'> {
  isOpen: boolean;
  header?: React.ReactNode | string;
  content?: React.ReactNode | string;
  buttons?: ButtonProps[];
  open: () => void;
  close: () => void;
}
