'use client';

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  modal,
} from '@nextui-org/react';
import { makeAutoObservable } from 'mobx';
import { observer } from 'mobx-react-lite';
import { createContext, useContext } from 'react';

type ModalProviderProps = {
  children: React.ReactNode;
};

export class ModalStore {
  constructor() {
    makeAutoObservable(this);
  }
  isOpen = false;
  modal: React.ReactNode | null;
  header: React.ReactNode | null;
  buttons: React.ReactNode | null;

  open = () => {
    this.isOpen = !this.isOpen;
  };

  setHeader = (header: React.ReactNode) => {
    this.header = header;
  };

  setContent = (modal: React.ReactNode) => {
    this.modal = modal;
  };

  setButtons = (buttons: React.ReactNode) => {
    this.buttons = buttons;
  };

  closeModal = () => {
    this.isOpen = false;
  };
}

const ModalContext = createContext<ModalStore>(new ModalStore());

const modalStore = new ModalStore();

export const ModalProvider = observer(({ children }: ModalProviderProps) => {
  console.log(modalStore.isOpen);
  return (
    <ModalContext.Provider value={modalStore}>
      {children}
      <Modal
        isDismissable
        onClose={modalStore.closeModal}
        isOpen={modalStore.isOpen}
      >
        <ModalContent>
          <ModalHeader>{modalStore.header}sdasd</ModalHeader>
          <ModalBody>teajsdodoi</ModalBody>
          <ModalFooter>tt</ModalFooter>
        </ModalContent>
      </Modal>
    </ModalContext.Provider>
  );
});

export const useModalStore = () => {
  return useContext(ModalContext);
};
