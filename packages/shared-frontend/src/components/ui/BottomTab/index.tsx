'use client';

import { observer } from 'mobx-react-lite';
import { Paths } from '../../../constants';
import { BottomTabView } from './BottomTabView';
import { MobxProps } from '../types';
import { get } from 'lodash-es';
import { useMobxHookForm } from '../../../hooks';

interface Route {
  name: string;
  pathname: Paths;
  params?: object;
  isVisible?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
  children?: Route[];
}

export interface BottomTabProps<T> extends MobxProps<T> {
  tabs: Route[];
}

export const BottomTab = observer(
  <T extends object>(props: BottomTabProps<T>) => {
    const { path = '', tabs, state } = props;
    const initialValue = get(state, path) as string;

    const { localState } = useMobxHookForm(initialValue, state, path);

    const onChange = (_, value) => {
      localState.value = value;
    };

    return (
      <BottomTabView
        {...props}
        tabs={tabs}
        value={localState.value}
        onChange={onChange}
        defaultValue={localState.value}
      />
    );
  },
);
