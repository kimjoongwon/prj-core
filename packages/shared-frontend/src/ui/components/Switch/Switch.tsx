;

import { ForwardedRef } from 'react';
import { action } from 'mobx';
import { MobxProps } from '../../../model';
import { Switch as NextUISwitch, SwitchProps as NextUISwitchProps } from '@nextui-org/react';
import { useMobxHookForm } from '../../../hooks';
import { get } from 'lodash-es';

export interface SwitchProps<T> extends NextUISwitchProps, MobxProps<T> {}

export function BaseSwitch<T extends object>(props: SwitchProps<T>, ref: ForwardedRef<HTMLInputElement>) {
  const { path = '', state = {}, ...rest } = props;

  const initialValue = get(state, path);

  const { localState } = useMobxHookForm(initialValue, state, path);

  const onChange = action((isSelected: boolean) => {
    localState.value = isSelected;
  });

  return <NextUISwitch {...rest} ref={ref} onValueChange={onChange} value={localState.value} />;
}
