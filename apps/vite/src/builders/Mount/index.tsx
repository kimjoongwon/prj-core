import { Modal, ModalContent, ModalHeader, ModalBody } from '@nextui-org/react';
import { PageBuilder } from '@shared/types';
import { useNavigate } from 'react-router-dom';

interface MountProps {
  children: React.ReactNode;
  type: PageBuilder['type'];
  name: PageBuilder['name'];
}

export const Mount = (props: MountProps) => {
  const { children, type, name } = props;
  const navigate = useNavigate();

  if (type === 'Form') {
    return (
      <Modal isOpen={true} onClose={() => navigate('..')}>
        <ModalContent>
          <ModalHeader>{name}</ModalHeader>
          <ModalBody>{children}</ModalBody>
        </ModalContent>
      </Modal>
    );
  }
  return <div>{children}</div>;
};
