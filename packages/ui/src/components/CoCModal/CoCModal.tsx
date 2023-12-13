import { Modal, ModalContent, ModalProps } from '@nextui-org/react';
import { observer, useLocalObservable } from 'mobx-react-lite';

interface CoCModalProps extends ModalProps {
  children: React.ReactNode;
}
export const CoCModal = observer((props: CoCModalProps) => {
  const { children } = props;
  const state = useLocalObservable(() => ({
    isOpen: true,
  }));
  return (
    <Modal isOpen={true} size="full">
      <ModalContent>{children}</ModalContent>
    </Modal>
  );
});
