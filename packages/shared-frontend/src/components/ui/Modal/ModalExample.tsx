import React from 'react';
import { Modal } from './index';
import { Button } from '@heroui/react';
import { Text } from '../Text';
import { modalService } from '../../../store/modal';

export const ModalExample: React.FC = () => {
  const handleOpenModal = () => {
    modalService.openModal({
      header: <Text variant="h3">Modal Title</Text>,
      body: (
        <div>
          <Text variant="body1">This is the modal body content.</Text>
          <Text variant="body2">You can add any React content here.</Text>
        </div>
      ),
      footer: (
        <div className="flex gap-2">
          <Button
            color="danger"
            variant="light"
            onPress={modalService.closeModal}
          >
            Cancel
          </Button>
          <Button color="primary" onPress={modalService.closeModal}>
            Confirm
          </Button>
        </div>
      ),
    });
  };

  const handleOpenSimpleModal = () => {
    modalService.openModal({
      header: 'Simple Modal',
      body: 'This is a simple modal with text content.',
    });
  };

  return (
    <div className="flex gap-4 p-4">
      <Button onPress={handleOpenModal}>Open Modal with Components</Button>
      <Button onPress={handleOpenSimpleModal}>Open Simple Modal</Button>

      <Modal />
    </div>
  );
};
