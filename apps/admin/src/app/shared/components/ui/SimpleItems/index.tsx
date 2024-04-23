import {
  Chip,
  Listbox,
  ListboxItem,
  ListboxProps,
  ScrollShadow,
} from '@nextui-org/react';
import { useMobxHookForm } from '@shared/frontend';
import { get } from 'lodash-es';
import { observer } from 'mobx-react-lite';
import { ReactNode } from 'react';
import React from 'react';

interface SimpleItemsProps {
  state: any;
  path: string;
  options: { text: string; value: any }[];
}

export const SimpleItems = observer((props: SimpleItemsProps) => {
  const { state = {}, path = '', options = [] } = props;
  const initialValues = get(state, path);
  const { localState } = useMobxHookForm(initialValues, state, path);

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
              {options?.find(option => option.value === itemValue)?.text}
            </Chip>
          );
        })}
      </ScrollShadow>
    );
  }, [localState.value?.length]);

  const handleSelectionChange: ListboxProps['onSelectionChange'] = keys => {
    const values = Array.from(keys);
    localState.value = values;
    return values;
  };

  return (
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
  );
});

export const ListboxWrapper = observer(
  ({ children }: { children: ReactNode }) => (
    <div className="w-full max-w-2xl border-small px-2 py-2 rounded-small border-default-200 dark:border-default-100">
      {children}
    </div>
  ),
);
