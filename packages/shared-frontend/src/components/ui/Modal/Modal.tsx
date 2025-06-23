import React from 'react';
import { observer } from 'mobx-react-lite';
import {
  Modal as HeroModal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@heroui/react';
import { X } from 'lucide-react';
import { modalService } from '../../../store/modal';
import type { CustomModalProps } from '@shared/types';

export const Modal: React.FC<CustomModalProps> = observer(
  ({ onClose, ...props }) => {
    const handleClose = () => {
      modalService.closeModal();
      onClose?.();
    };

    return (
      <HeroModal
        isOpen={modalService.isOpen}
        onClose={handleClose}
        placement="center"
        backdrop="blur"
        scrollBehavior="inside"
        {...props}
      >
        <ModalContent>
          {modalService.header && (
            <ModalHeader className="flex justify-between items-center">
              <div className="flex-1">{modalService.header}</div>
              <Button
                isIconOnly
                variant="light"
                onPress={handleClose}
                aria-label="Close modal"
                className="ml-2"
              >
                <X size={20} />
              </Button>
            </ModalHeader>
          )}

          {modalService.body && <ModalBody>{modalService.body}</ModalBody>}

          {modalService.footer && (
            <ModalFooter>{modalService.footer}</ModalFooter>
          )}
        </ModalContent>
      </HeroModal>
    );
  },
);

Modal.displayName = 'Modal';
