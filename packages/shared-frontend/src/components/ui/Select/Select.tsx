import { observer } from 'mobx-react-lite';
import {
  Select as NextSelect,
  SelectItem,
  SelectProps as NextUISelectProps,
} from '@nextui-org/react';
import { MobxProps } from '../types';
import { cloneDeep, get } from 'lodash-es';
import { useMobxHookForm } from '../../../hooks';

interface SelectProps<T>
  extends Omit<NextUISelectProps, 'children'>,
    MobxProps<T> {
  options?: any[];
}

export const Select = observer(<T extends object>(props: SelectProps<T>) => {
  const { state = {}, path = '', options = [], value, ...rest } = props;

  const _options = cloneDeep(options);

  const initialValue =
    _options?.find(option => option.value === get(state, path))?.value || value;

  const { localState } = useMobxHookForm(initialValue, state, path);

  return (
    <NextSelect
      variant="bordered"
      {...rest}
      onChange={e => {
        localState.value = e.target.value;
      }}
      selectedKeys={localState.value ? [localState.value] : undefined}
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
