import { SelectModal } from '@modals';
import { modalStore } from '@stores';

export const ModalMount = () => {
  return <>{modalStore.SelectModal.isOpen && <SelectModal />}</>;
};
