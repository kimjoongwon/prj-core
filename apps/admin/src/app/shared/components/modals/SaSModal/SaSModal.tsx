import { useMobxHookForm } from '@coc/ui';
import {
  Listbox,
  ListboxItem,
  Modal,
  ModalBody,
  ModalContent,
  Selection,
} from '@nextui-org/react';
import { modalStore } from '@stores';
import { get } from 'lodash-es';

export const SaSModal = () => {
  const { isOpen, path = '', state = {} } = modalStore.SasModal;
  const initialValues = get(state, path);

  const { localState } = useMobxHookForm(initialValues, state, path);
  const handleSelectionChange = (keys: Selection) => {
    console.log('?');
  };

  return (
    <Modal isOpen={isOpen}>
      <ModalContent>
        <ModalBody>
          <Listbox
            selectionMode="multiple"
            items={[]}
            variant="flat"
            onSelectionChange={handleSelectionChange}
          >
            {item => {
              return <ListboxItem key={'test1'}>test</ListboxItem>;
            }}
          </Listbox>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
