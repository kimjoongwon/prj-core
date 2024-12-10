import { observer } from 'mobx-react-lite';
import { useMobxHookForm } from '../../../hooks';
import { get } from 'lodash-es';
import { MobxProps } from '@shared/types';
import {
  ListboxItemProps,
  type ListboxProps as NextUIListboxProps,
} from '@nextui-org/react';
import { ListboxView } from './ListboxView';

export interface ListBoxProps<T>
  extends Omit<NextUIListboxProps, 'state' | 'children'>,
    MobxProps<T> {
  items: ListboxItemProps[];
}
export const Listbox = observer(<T extends object>(props: ListBoxProps<T>) => {
  const { state, path = '', ...rest } = props;

  const value = get(state, path);
  const { localState } = useMobxHookForm(value, state, path);

  return (
    <ListboxView
      {...rest}
      value={localState.value}
      selectionMode="single"
      onSelectionChange={selection => {
        localState.value = new Set(selection).values().next().value;
      }}
    />
  );
});
