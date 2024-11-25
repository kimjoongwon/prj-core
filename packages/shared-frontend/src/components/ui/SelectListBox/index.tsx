'use client';

import {
  Chip,
  Listbox,
  ListboxItem,
  ListboxProps,
  ScrollShadow,
  SelectionMode,
} from '@nextui-org/react';
import { get } from 'lodash-es';
import { observer } from 'mobx-react-lite';
import { ReactNode } from 'react';
import React from 'react';
import { useMobxHookForm } from '../../../hooks/useMobxHookForm';
import { Message } from '../Message';

interface SimpleItemsProps {
  selectionMode?: SelectionMode;
  state: any;
  path: string;
  options: { text: string; value: any }[];
  onSelectionChange?: (values: any) => void;
}

export const SelectListBox = observer((props: SimpleItemsProps) => {
  const {
    state = {},
    path = '',
    options = [],
    selectionMode = 'multiple',
    onSelectionChange,
  } = props;

  const initialValues = get(state, path);

  const { localState } = useMobxHookForm(initialValues, state, path);

  const topContent = React.useMemo(() => {
    if (!localState.value?.length) {
      return <Message title="Info" message="선택된 항목이 없습니다." />;
    }

    return (
      <ScrollShadow
        hideScrollBar
        className="w-full flex py-0.5 px-2 gap-1"
        orientation="horizontal"
      >
        {selectionMode === 'multiple' &&
          localState.value?.map((itemValue: any) => {
            return (
              <Chip key={itemValue}>
                {options?.find(option => option.value === itemValue)?.text}
              </Chip>
            );
          })}
        {selectionMode === 'single' && (
          <Chip>
            {options.find(option => option.value === localState.value)?.text}
          </Chip>
        )}
      </ScrollShadow>
    );
  }, [localState.value?.length]);

  const handleSelectionChange: ListboxProps['onSelectionChange'] = keys => {
    const values = Array.from(keys);
    onSelectionChange && onSelectionChange(values);
    localState.value = selectionMode === 'multiple' ? values : values[0];
    return values;
  };

  return (
    <ListboxWrapper>
      <Listbox
        className="w-full"
        topContent={topContent}
        selectionMode={selectionMode}
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
                <span className="text-small">{item.text}</span>
              </div>
            </ListboxItem>
          );
        }}
      </Listbox>
    </ListboxWrapper>
  );
});

export const ListboxWrapper = observer(
  ({ children }: { children: ReactNode }) => (
    <div className="w-full max-w-2xl border-small px-2 py-2 rounded-small border-default-200 dark:border-default-100">
      {children}
    </div>
  ),
);
