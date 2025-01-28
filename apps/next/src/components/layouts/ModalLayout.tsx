'use client';
import { Modal, ModalContent, ModalHeader, ModalBody } from '@heroui/react';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/navigation';

export const ModalLayout = observer((props: any) => {
  const { children, layoutBuilder } = props;
  const router = useRouter();

  return (
    <Modal
      size="full"
      isOpen={true}
      className="relative"
      isDismissable
      onClose={router.back}
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader>{layoutBuilder?.page?.name}</ModalHeader>
        <ModalBody>{children}</ModalBody>
      </ModalContent>
    </Modal>
  );
});
