import { ForwardedRef } from 'react';
import { action } from 'mobx';
import { SwitchProps } from '@shared/types';
import { Switch as NextUISwitch } from '@heroui/react';
import { useMobxHookForm } from '../../../..';
import { get } from 'lodash-es';

export function BaseSwitch<T extends object>(
  props: SwitchProps<T>,
  ref: ForwardedRef<HTMLInputElement>,
) {
  const { path = '', state = {}, ...rest } = props;

  const initialValue = get(state, path);

  const { localState } = useMobxHookForm(initialValue, state, path);

  const onChange = action((isSelected: boolean) => {
    localState.value = isSelected;
  });

  return (
    <NextUISwitch
      {...rest}
      ref={ref}
      onValueChange={onChange}
      value={localState.value}
    />
  );
}
