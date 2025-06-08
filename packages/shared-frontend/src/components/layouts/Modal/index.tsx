import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@heroui/react';
import { ReactNode, useEffect, useState } from 'react';
import { Plate } from '../../../providers';
import { useNavigate } from 'react-router';

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
  size = 'md',
  placement = 'center',
  backdrop = 'opaque',
  hideCloseButton = false,
  isDismissable = true,
  isKeyboardDismissDisabled = false,
  footer,
  className,
  scrollBehavior = 'normal',
}: ModalLayoutProps) {
  const naviate = useNavigate();
  return (
    <Modal
      isOpen={true}
      onClose={() => naviate(-1)}
      size={size}
      placement={placement}
      backdrop={backdrop}
      hideCloseButton={hideCloseButton}
      isDismissable={isDismissable}
      isKeyboardDismissDisabled={isKeyboardDismissDisabled}
      className={className}
      scrollBehavior={scrollBehavior}
    >
      <ModalContent>
        {() => (
          <>
            {title && <ModalHeader>{title}</ModalHeader>}
            <ModalBody>{children}</ModalBody>
            {footer && <ModalFooter>{footer}</ModalFooter>}
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default ModalLayout;
