import { Modal, ModalContent, ModalBody } from '@heroui/react';
import { ReactNode } from 'react';
import { useNavigate } from 'react-router';
import { Plate } from '../../../providers';

interface ModalLayoutProps {
  children: ReactNode;
  title?: string;
  size?:
    | 'xs'
    | 'sm'
    | 'md'
    | 'lg'
    | 'xl'
    | '2xl'
    | '3xl'
    | '4xl'
    | '5xl'
    | 'full';
  placement?:
    | 'auto'
    | 'top'
    | 'top-center'
    | 'center'
    | 'bottom'
    | 'bottom-center';
  backdrop?: 'transparent' | 'opaque' | 'blur';
  hideCloseButton?: boolean;
  isDismissable?: boolean;
  isKeyboardDismissDisabled?: boolean;
  onClose?: () => void;
  footer?: ReactNode;
  className?: string;
  scrollBehavior?: 'normal' | 'inside' | 'outside';
}

export function ModalLayout({
  children,
  title,
  size = '4xl',
  placement = 'center',
  backdrop = 'opaque',
  hideCloseButton = false,
  isDismissable = true,
  isKeyboardDismissDisabled = false,
  className,
  scrollBehavior = 'normal',
}: ModalLayoutProps) {
  const naviate = useNavigate();
  return (
    <Modal
      isOpen={true}
      onClose={() => Plate.navigation.getNavigator().goBack()}
      size={size}
      placement={placement}
      backdrop="transparent"
      hideCloseButton={hideCloseButton}
      isDismissable={isDismissable}
      isKeyboardDismissDisabled={isKeyboardDismissDisabled}
      className={className}
      scrollBehavior={scrollBehavior}
    >
      <ModalContent>
        <ModalBody>{children}</ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default ModalLayout;
