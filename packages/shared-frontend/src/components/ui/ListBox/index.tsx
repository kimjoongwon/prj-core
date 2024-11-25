import { ListBoxProps } from '@shared/types';
import { observer } from 'mobx-react-lite';
import { ListboxView } from './ListboxView';
import { useMobxHookForm } from '../../../hooks';
import { get } from 'lodash-es';

export const Listbox = observer(<T extends object>(props: ListBoxProps<T>) => {
  const { state, path = '' } = props;

  const value = get(state, path);
  const { localState } = useMobxHookForm(value, state, path);

  return (
    <ListboxView
      {...props}
      value={localState.value}
      selectionMode="single"
      onSelectionChange={selection => {
        localState.value = selection.toString();
      }}
    />
  );
});
