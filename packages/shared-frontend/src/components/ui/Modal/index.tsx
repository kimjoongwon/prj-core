import { observer } from 'mobx-react-lite';
import {
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Modal as NextUIModal,
} from '@nextui-org/react';

import { useApp } from '../../../providers/App';

export const ModalMount = observer(() => {
  const app = useApp();
  const modal = app?.modal!;

  return (
    <NextUIModal isDismissable onClose={modal?.close} isOpen={modal?.open}>
      <ModalContent>
        <ModalHeader>{modal?.header}</ModalHeader>
        <ModalBody>{modal?.body}</ModalBody>
        <ModalFooter>{modal?.footer}</ModalFooter>
      </ModalContent>
    </NextUIModal>
  );
});
