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

interface ModalProps {}

export const CoCModal = observer((props: ModalProps) => {
  const modal = useModal();
  return (
    <Modal isOpen={modal.isOpen}>
      <ModalContent>
        <ModalHeader>{modal.title}</ModalHeader>
        <ModalBody>
          <p>Modal Body</p>
        </ModalBody>
        <ModalFooter>
          <Button onClick={modal.close}>Cancel</Button>
          <Button>Confirm</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
});
