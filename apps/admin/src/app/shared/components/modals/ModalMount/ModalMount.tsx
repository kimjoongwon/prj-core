import { SaSModal } from '@components';
import { modalStore } from '@stores';

export const ModalMount = () => {
  return <>{modalStore.SasModal.isOpen && <SaSModal />}</>;
};
