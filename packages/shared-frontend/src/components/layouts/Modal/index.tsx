import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/react';
import { ReactNode, useEffect, useState } from 'react';

interface ModalLayoutProps {
  children: ReactNode;
  title?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full';
  placement?: 'auto' | 'top' | 'top-center' | 'center' | 'bottom' | 'bottom-center';
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
  onClose,
  footer,
  className,
  scrollBehavior = 'normal'
}: ModalLayoutProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // 컴포넌트가 마운트되면 항상 모달을 표시
    setIsOpen(true);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    if (onClose) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      onClose={handleClose}
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
        {(onClose) => (
          <>
            {title && (
              <ModalHeader className="flex flex-col gap-1">
                {title}
              </ModalHeader>
            )}
            <ModalBody>
              {children}
            </ModalBody>
            {footer && (
              <ModalFooter>
                {footer}
              </ModalFooter>
            )}
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default ModalLayout;
