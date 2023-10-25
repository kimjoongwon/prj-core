import { Modal, ModalContent } from '@nextui-org/react';
import { observer } from 'mobx-react-lite';
interface CoCModalProps {
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
