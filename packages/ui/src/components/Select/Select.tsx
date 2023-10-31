import { observer, useLocalObservable } from 'mobx-react-lite';
import {
  Select as NextSelect,
  SelectItem,
  SelectItemProps,
  SelectProps as NextUISelectProps,
} from '@nextui-org/react';
import { MobxProps } from '../../types';
import { Key, useEffect } from 'react';
import { reaction } from 'mobx';
import { get, set } from 'lodash-es';

interface SelectProps<T>
  extends Omit<NextUISelectProps, 'children'>,
    MobxProps<T> {
  options?: any[];
}

export const Select = observer(<T extends object>(props: SelectProps<T>) => {
  const { state = {}, path = '', options = [], ...rest } = props;

  const localState = useLocalObservable<{ value: SelectItemProps['value'] }>(
    () => ({
      value: options?.find(option => option.value === get(state, path))?.value,
    }),
  );

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
        localState.value = value;
      },
    );

    return () => {
      disposer();
    };
  }, []);

  return (
    <NextSelect
      variant="bordered"
      {...rest}
      onSelectionChange={keys => {
        if (typeof keys === 'string') {
          localState.value = keys;
        }
        if (keys instanceof Set<Key>) {
          localState.value = Array.from(keys)[0] as string;
        }
      }}
      value={localState.value}
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
