import { Modal, ModalContent } from '@coc/ui';
import { Provider } from '../../../../../admin/categories/[id]/edit/provider';

export default function Layout(props: { children: React.ReactNode }) {
  const { children } = props;
  return (
    <Modal isOpen={true}>
      <ModalContent>
        <Provider>{children}</Provider>
      </ModalContent>
    </Modal>
  );
}
