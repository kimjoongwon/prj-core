import { observer } from 'mobx-react-lite';
import { MainNavBarProps } from '@shared/types';
import { useMobxHookForm } from '../../../hooks';
import { MainNavBarView } from './MainNavBarView';
import { ButtonProps } from '@nextui-org/react';
import { get } from 'lodash-es';
import { action } from 'mobx';

export const MainNavBar = observer(
  <T extends object>(props: MainNavBarProps<T>) => {
    const { state, path = '', value, ...rest } = props;
    const initialValue = (get(state, path) as string) || value;
    const { localState } = useMobxHookForm(initialValue, state, path);

    const onClickNavBarItem = action((value: string) => {
      localState.value = value;
    });

    return (
      <MainNavBarView
        value={localState.value}
        {...rest}
        onClickNavBarItem={onClickNavBarItem}
      />
    );
  },
);
