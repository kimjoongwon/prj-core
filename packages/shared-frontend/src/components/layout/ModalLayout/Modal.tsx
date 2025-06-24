import {
  Modal,
  ModalContent,
  ModalBody,
  ModalProps,
  ModalHeader,
} from '@heroui/react';
import { Plate, usePage } from '../../../provider';

interface ModalLayoutProps extends ModalProps {}

export function ModalLayout(props: ModalLayoutProps) {
  const page = usePage();

  return (
    <Modal
      isOpen={true}
      onClose={() => Plate.navigator.goBack()}
      scrollBehavior="inside"
      size="5xl"
      {...props}
    >
      <ModalContent>
        <ModalHeader>{page.name}</ModalHeader>
        <ModalBody>{props.children}</ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default ModalLayout;
