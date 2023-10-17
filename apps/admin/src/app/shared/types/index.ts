import { ModalProps } from '@nextui-org/react';

export interface RawItems<T> {
  data: T[];
  renderItem: (item: T) => React.ReactNode;
}

export interface ModalProviderProps {
  children: React.ReactNode;
}

export interface CoCModalProps extends Omit<ModalProps, 'content'> {
  isOpen: boolean;
  header?: React.ReactNode;
  content?: React.ReactNode;
  footer?: React.ReactNode;
  open: () => void;
  close: () => void;
}
