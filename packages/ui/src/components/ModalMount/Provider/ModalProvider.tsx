import { ModalProps } from '@nextui-org/react';
import { useLocalObservable } from 'mobx-react-lite';
import { createContext, useContext } from 'react';

interface ModalState extends Omit<ModalProps, 'children'> {
  header?: string | React.ReactNode;
  body?: string | React.ReactNode;
  footer?: string | React.ReactNode;
  onConfirm?: () => void;
  onClose?: () => void;
}

export const ModalContext = createContext<ModalState>({} as ModalState);

export const useModal = () => {
  return useContext(ModalContext);
};

interface ModalProviderProps {
  children: React.ReactNode;
}

export const ModalProvider = (props: ModalProviderProps) => {
  const { children } = props;
  const initialState: ModalState = {
    isOpen: false,
  };

  const state = useLocalObservable<ModalState>(() => ({ ...initialState }));

  return <ModalContext.Provider value={state}>{children}</ModalContext.Provider>;
};
