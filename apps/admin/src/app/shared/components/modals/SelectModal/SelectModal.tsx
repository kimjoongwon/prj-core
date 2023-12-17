import React, { ReactNode } from 'react';
import { useMobxHookForm } from '@coc/ui';
import {
  Chip,
  Listbox,
  ListboxItem,
  Modal,
  ModalContent,
  ModalHeader,
  ScrollShadow,
  Selection,
} from '@nextui-org/react';
import { modalStore } from '@stores';
import { get } from 'lodash-es';

export const SelectModal = () => {
  const {
    isOpen,
    path = '',
    state = {},
    options = [
      {
        text: 'test',
        value: 'test',
      },
      {
        text: 'test2',
        value: 'test2',
      },
    ],
  } = modalStore.SelectModal;
  const initialValues = get(state, path);

  const { localState } = useMobxHookForm(initialValues, state, path);

  const handleSelectionChange = (keys: Selection) => {
    const values = Array.from(keys);
    localState.value = values;
  };

  const topContent = React.useMemo(() => {
    if (!localState.value.length) {
      return null;
    }

    return (
      <ScrollShadow
        hideScrollBar
        className="w-full flex py-0.5 px-2 gap-1"
        orientation="horizontal"
      >
        {localState.value.map((itemValue: any) => {
          return (
            <Chip key={itemValue}>
              {options?.find(option => option.value === itemValue)?.text}
            </Chip>
          );
        })}
      </ScrollShadow>
    );
  }, [localState.value.length]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => (modalStore.SelectModal.isOpen = false)}
    >
      <ModalContent className="p-4">
        <ModalHeader>테스트</ModalHeader>
        <ListboxWrapper>
          <Listbox
            className="w-full"
            topContent={topContent}
            selectionMode="multiple"
            items={options}
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
      </ModalContent>
    </Modal>
  );
};

export const ListboxWrapper = ({ children }: { children: ReactNode }) => (
  <div className="w-full max-w-2xl border-small px-2 py-2 rounded-small border-default-200 dark:border-default-100">
    {children}
  </div>
);
