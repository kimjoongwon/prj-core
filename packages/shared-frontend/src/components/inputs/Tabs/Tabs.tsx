import { TabsProps } from '@shared/types';
import { TabsView } from './TabsView';
import { get } from 'lodash-es';
import { Key } from 'react';
import { useMobxHookForm } from '../../../hooks';

export const Tabs = <T extends any>(props: TabsProps<T>) => {
  const { state, path = '' } = props;
  const value = get(state, path);
  const { localState } = useMobxHookForm(get(state, path), state, path);

  const onSelectionChange = (key: Key) => {
    localState.value = key;
  };

  return (
    <TabsView value={value} {...props} onSelectionChange={onSelectionChange} />
  );
};
