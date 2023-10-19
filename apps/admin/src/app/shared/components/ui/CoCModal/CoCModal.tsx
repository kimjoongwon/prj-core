'use client';

import { Button } from '@coc/ui';
import { useModal } from '@hooks';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import { observer } from 'mobx-react-lite';

export const CoCModal = observer(() => {
  const modal = useModal();

  return (
    <Modal isOpen={modal.isOpen} onClose={() => modal.close()}>
      <ModalContent>
        <ModalHeader>{modal.header}</ModalHeader>
        <ModalBody>{modal.content}</ModalBody>
        <ModalFooter>
          {modal.buttons?.map(button => (
            <Button {...button}>{button.children}</Button>
          ))}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
});
