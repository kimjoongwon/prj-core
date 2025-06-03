import { Modal, ModalContent, ModalProps } from "@heroui/react";
import { CoCModalProps } from '@shared/types';

export function PageModal(props: CoCModalProps) {
  const { children } = props;

  return (
    <Modal isOpen={true} size="full">
      <ModalContent>{children}</ModalContent>
    </Modal>
  );
}
