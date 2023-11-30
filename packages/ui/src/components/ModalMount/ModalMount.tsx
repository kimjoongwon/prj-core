import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import { useModal } from './Provider';

export const ModalMount = () => {
  const modal = useModal();
  return (
    <Modal size={'2xl'} isOpen={modal.isOpen} onClose={() => (modal.isOpen = false)}>
      <ModalContent>
        {() => {
          return (
            <>
              <ModalHeader>{modal.header}</ModalHeader>
              <ModalBody>{modal.body}</ModalBody>
              <ModalFooter>{modal.footer}</ModalFooter>
            </>
          );
        }}
      </ModalContent>
    </Modal>
  );
};
