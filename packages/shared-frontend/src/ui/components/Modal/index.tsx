import { observer } from 'mobx-react-lite';
import {
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Modal as NextUIModal,
} from '@nextui-org/react';
import { modalStore } from '../../../stores/modalStore';
import { action } from 'mobx';

export const _Modal = observer(() => {
  return (
    <NextUIModal
      isDismissable
      onClose={action(() => (modalStore.open = false))}
      isOpen={modalStore.open}
    >
      <ModalContent>
        <ModalHeader>{modalStore.header}sdasd</ModalHeader>
        <ModalBody></ModalBody>
        <ModalFooter>tt</ModalFooter>
      </ModalContent>
    </NextUIModal>
  );
});
