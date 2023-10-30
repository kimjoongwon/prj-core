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
  selectItems?: SelectItemProps[];
}

export const Select = observer(<T extends object>(props: SelectProps<T>) => {
  const { state = {}, path = '', selectItems = [] } = props;

  const localState = useLocalObservable<{ value: SelectItemProps['value'] }>(
    () => ({
      value: selectItems.find(option => option.value === get(state, path))
        ?.value,
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
      onSelectionChange={keys => {
        if (typeof keys === 'string') {
          localState.value = keys;
        }
        if (keys instanceof Set<Key>) {
          localState.value = Array.from(keys)[0] as string;
        }
      }}
    >
      {selectItems.map(selectItem => {
        return (
          <SelectItem key={selectItem.key} value={selectItem.value}>
            {selectItem.title}
          </SelectItem>
        );
      })}
    </NextSelect>
  );
});
