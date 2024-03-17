import React, { ReactNode } from 'react';
import { useMobxHookForm } from '@coc/web';
import {
  Chip,
  Listbox,
  ListboxItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ScrollShadow,
  Selection,
} from '@nextui-org/react';
import { modalStore } from '@stores';
import { get } from 'lodash-es';
import { observer } from 'mobx-react-lite';

export const SelectModalView = observer(() => {
  const selectModal = modalStore.SelectModal;
  const initialValues = get(selectModal.state, selectModal.path);
  const { localState } = useMobxHookForm(
    initialValues,
    selectModal.state,
    selectModal.path,
  );

  const handleSelectionChange = (keys: Selection) => {
    const values = Array.from(keys);
    localState.value = values;
  };

  const topContent = React.useMemo(() => {
    if (!localState.value?.length) {
      return null;
    }

    return (
      <ScrollShadow
        hideScrollBar
        className="w-full flex py-0.5 px-2 gap-1"
        orientation="horizontal"
      >
        {localState.value?.map((itemValue: any) => {
          return (
            <Chip key={itemValue}>
              {
                selectModal.options?.find(option => option.value === itemValue)
                  ?.text
              }
            </Chip>
          );
        })}
      </ScrollShadow>
    );
  }, [localState.value?.length]);
  return (
    <Modal
      isOpen={modalStore.SelectModal.isOpen}
      onClose={() => (modalStore.SelectModal.isOpen = false)}
    >
      <ModalContent className="p-4">
        <ModalHeader>헤더</ModalHeader>
        <ModalHeader>헤더</ModalHeader>
        <ModalHeader>헤더</ModalHeader>
        <ModalBody>
          <ListboxWrapper>
            <Listbox
              className="w-full"
              topContent={topContent}
              selectionMode="multiple"
              items={selectModal.options}
              variant="flat"
              classNames={{
                list: 'max-h-[300px] overflow-scroll',
              }}
              defaultSelectedKeys={localState.value}
              onSelectionChange={handleSelectionChange}
            >
              {item => {
                return (
                  <ListboxItem
                    className="w-full"
                    key={item.value}
                    textValue={item.value}
                  >
                    <div className="flex gap-2 items-center">
                      <span className="text-small">{item.value}</span>
                    </div>
                  </ListboxItem>
                );
              }}
            </Listbox>
          </ListboxWrapper>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
});

export const ListboxWrapper = observer(
  ({ children }: { children: ReactNode }) => (
    <div className="w-full max-w-2xl border-small px-2 py-2 rounded-small border-default-200 dark:border-default-100">
      {children}
    </div>
  ),
);
