import { observer } from 'mobx-react-lite';
import {
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Modal as NextUIModal,
} from '@nextui-org/react';

import { galaxy, useApp } from '../../../providers/App';

export const ModalMount = observer(() => {
  const { modal } = galaxy;

  return (
    <NextUIModal isDismissable onClose={modal.destory} isOpen={modal.open}>
      <ModalContent>
        <ModalHeader>{modal?.header}</ModalHeader>
        <ModalBody>{modal?.body}</ModalBody>
        <ModalFooter>{modal?.footer}</ModalFooter>
      </ModalContent>
    </NextUIModal>
  );
});
