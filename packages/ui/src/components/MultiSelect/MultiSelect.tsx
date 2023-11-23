'use client';

import { observer, useLocalObservable } from 'mobx-react-lite';
import { Select as NextSelect, SelectItem, SelectProps as NextUISelectProps } from '@nextui-org/react';
import { MobxProps } from '../../types';
import { useEffect } from 'react';
import { reaction } from 'mobx';
import { get, set } from 'lodash-es';

interface SelectProps<T> extends Omit<NextUISelectProps, 'children'>, MobxProps<T> {
  options?: any[];
}

export const MultiSelect = observer(<T extends object>(props: SelectProps<T>) => {
  const { state = {}, path = '', options = [], ...rest } = props;

  const defaultValues = get(state, path) || [];

  const localState = useLocalObservable<{ value: string[] }>(() => ({
    value: defaultValues,
  }));

  useEffect(() => {
    const disposer = reaction(
      () => localState.value,
      value => {
        set(state, path, value);
      },
    );

    return () => {
      disposer();
    };
  }, []);

  useEffect(() => {
    const disposer = reaction(
      () => get(state, path),
      value => {
        localState.value = value || [];
      },
    );

    return () => {
      disposer();
    };
  }, []);
  console.log('localState.value', localState.value);
  return (
    <NextSelect
      variant="bordered"
      {...rest}
      selectionMode="multiple"
      onChange={e => {
        localState.value = e.target.value?.split(',') || [];
      }}
      selectedKeys={new Set(localState.value)}
    >
      {options.map(option => {
        return (
          <SelectItem key={option.value} value={option.value}>
            {option.name}
          </SelectItem>
        );
      })}
    </NextSelect>
  );
});
