'use client';

import { Modal, ModalContent, ModalHeader, ModalBody } from '@heroui/react';
import { LayoutBuilder } from '@shared/types';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/navigation';

export const ModalLayout = observer(
  (props: { children: React.ReactNode; layoutBuilder?: LayoutBuilder }) => {
    const { children, layoutBuilder } = props;
    const router = useRouter();

    return (
      <Modal
        size="full"
        isOpen={true}
        isDismissable
        onClose={() => router.back()}
      >
        <ModalContent>
          <ModalHeader>{layoutBuilder?.name}</ModalHeader>
          <ModalBody>{children}</ModalBody>
        </ModalContent>
      </Modal>
    );
  },
);
