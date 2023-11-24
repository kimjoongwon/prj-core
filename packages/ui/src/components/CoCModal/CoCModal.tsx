;

import { Modal, ModalContent, ModalProps } from '@nextui-org/react';
import { observer } from 'mobx-react-lite';
interface CoCModalProps extends ModalProps {
  children: React.ReactNode;
}
export const CoCModal = observer((props: CoCModalProps) => {
  const { children } = props;
  return (
    <Modal isOpen>
      <ModalContent>{children}</ModalContent>
    </Modal>
  );
});
