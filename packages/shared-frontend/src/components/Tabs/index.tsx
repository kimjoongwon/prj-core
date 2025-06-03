'use client';

import { MobxProps } from '@shared/types';
import { TabsView } from './TabsView';
import { get } from 'lodash-es';
import { Key } from 'react';
import { useMobxHookForm } from '../../hooks';

export interface Option {
  key: string;
  text: string;
  value: string;
}

export interface TabsProps<T> extends MobxProps<T> {
  options: Option[];
}

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
