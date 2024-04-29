import { observer } from 'mobx-react-lite';
import {
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Modal as NextUIModal,
} from '@nextui-org/react';
import { action } from 'mobx';
import { modalStore } from '../../../stores/modalStore';

export const ModalMount = observer(() => {
  return (
    <NextUIModal
      isDismissable
      onClose={action(() => (modalStore.open = false))}
      isOpen={modalStore.open}
    >
      <ModalContent>
        <ModalHeader>{modalStore.header}</ModalHeader>
        <ModalBody>{modalStore.body}</ModalBody>
        <ModalFooter>{modalStore.footer}</ModalFooter>
      </ModalContent>
    </NextUIModal>
  );
});
