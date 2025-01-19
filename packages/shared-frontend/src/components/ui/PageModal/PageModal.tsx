import { Modal, ModalContent, ModalProps } from "@heroui/react";

interface CoCModalProps extends ModalProps {
  children: React.ReactNode;
}

export function PageModal(props: CoCModalProps) {
  const { children } = props;

  return (
    <Modal isOpen={true} size="full">
      <ModalContent>{children}</ModalContent>
    </Modal>
  );
}
