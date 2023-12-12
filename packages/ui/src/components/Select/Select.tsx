import { observer, useLocalObservable } from 'mobx-react-lite';
import { Select as NextSelect, SelectItem, SelectProps as NextUISelectProps } from '@nextui-org/react';
import { MobxProps } from '../../types';
import { useEffect } from 'react';
import { reaction } from 'mobx';
import { cloneDeep, get, set } from 'lodash-es';

interface SelectProps<T> extends Omit<NextUISelectProps, 'children'>, MobxProps<T> {
  options?: any[];
}

export const Select = observer(<T extends object>(props: SelectProps<T>) => {
  const { state = {}, path = '', options = [], ...rest } = props;

  const _options = cloneDeep(options);
  const localState = useLocalObservable<{ value?: string }>(() => ({
    value: _options?.find(option => option.value === get(state, path))?.value || undefined,
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
        localState.value = value || undefined;
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
      onChange={e => {
        localState.value = e.target.value;
      }}
      selectedKeys={localState.value ? [localState.value] : undefined}
      // value={localState.value}
    >
      {_options.map(option => {
        return (
          <SelectItem key={option.value} value={option.value}>
            {option.text}
          </SelectItem>
        );
      })}
    </NextSelect>
  );
});
