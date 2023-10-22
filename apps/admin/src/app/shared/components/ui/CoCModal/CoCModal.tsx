'use client';

import { Button } from '@coc/ui';
import { useModal } from '@hooks';
import {
  ButtonProps,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalProps,
} from '@nextui-org/react';
import { observer } from 'mobx-react-lite';

export interface CoCModalProps
  extends Omit<ModalProps, 'content' | 'children'> {
  isOpen: boolean;
  header: React.ReactNode | string;
  content: React.ReactNode | string;
  buttons?: ButtonProps[];
  open: () => void;
  close: () => void;
}

export const CoCModal = observer(() => {
  const modal = useModal();

  return (
    <Modal isOpen={modal.isOpen} onClose={() => modal.close()}>
      <ModalContent>
        <ModalHeader>{modal.header}</ModalHeader>
        <ModalBody>{modal.content}</ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
});
