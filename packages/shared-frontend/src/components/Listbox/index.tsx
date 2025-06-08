'use client';

import { Listbox as HeroListbox, ListboxItem } from '@heroui/react';
import { get, set } from 'lodash-es';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { ReactNode, useEffect } from 'react';
import { ListboxProps } from '@shared/types';
import { reaction } from 'mobx';
import { Text } from '../Text';

export const Listbox = observer(<T extends object>(props: ListboxProps<T>) => {
  const {
    state = {},
    path = '',
    options = [],
    selectionMode = 'multiple',
    title,
  } = props;

  const initialValue = get(state, path);

  const localState = useLocalObservable<{
    value: Set<any>;
  }>(() => ({
    value: new Set([initialValue]),
  }));

  useEffect(() => {
    const disposer = reaction(
      () => localState.value,
      () => {
        if (selectionMode === 'single') {
          set(state, path, Array.from(localState.value)[0]);
          return;
        }
        set(state, path, Array.from(localState.value));
      },
    );

    return disposer;
  }, []);

  const handleSelectionChange: ListboxProps<T>['onSelectionChange'] =
    selection => {
      const selectedKeys = Array.from(selection);
      localState.value = new Set(selectedKeys);
    };

  return (
    <ListboxWrapper>
      {title && (
        <div className="mb-3">
          <Text variant="h6" className="font-semibold">
            {title}
          </Text>
        </div>
      )}
      <HeroListbox
        className="w-full"
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
            <ListboxItem className="w-full" key={item.value}>
              {item.text}
            </ListboxItem>
          );
        }}
      </HeroListbox>
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
