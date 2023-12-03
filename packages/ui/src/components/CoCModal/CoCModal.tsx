import { Modal, ModalContent, ModalProps } from '@nextui-org/react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useState } from 'react';
interface CoCModalProps extends ModalProps {
  children: React.ReactNode;
}
export const CoCModal = observer((props: CoCModalProps) => {
  const { children } = props;
  const state = useLocalObservable(() => ({
    isOpen: true,
  }));
  return (
    <Modal isOpen={true}>
      <ModalContent>{children}</ModalContent>
    </Modal>
  );
});
