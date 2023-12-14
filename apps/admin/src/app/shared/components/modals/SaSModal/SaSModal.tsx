import { useMobxHookForm } from '@coc/ui';
import {
  Listbox,
  ListboxItem,
  Modal,
  ModalBody,
  ModalContent,
} from '@nextui-org/react';
import { modalStore } from '@stores';
import { get } from 'lodash-es';

export const SaSModal = () => {
  const { isOpen, path = '', state = {} } = modalStore.SasModal;
  const initialValues = get(state, path);

  const { localState } = useMobxHookForm(initialValues, state, path);

  return (
    <Modal isOpen={modalStore.SasModal.isOpen}>
      <ModalContent>
        <ModalBody>
          <Listbox selectedKeys={[]} items={[]}>
            {item => {
              return <ListboxItem key={'test1'}>test</ListboxItem>;
            }}
          </Listbox>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
