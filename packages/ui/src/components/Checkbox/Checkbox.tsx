import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import { getMobxValue } from '@kimjwally/utils';
import { useMobxHookForm } from '../../hooks';
import { MobxProps } from '../../types';
import {
  Checkbox as NextUICheckbox,
  CheckboxProps as NextUICheckboxProps,
} from '@nextui-org/react';

export interface CheckboxProps<T> extends MobxProps<T>, NextUICheckboxProps {}

export function BaseCheckbox<T extends object>(props: CheckboxProps<T>) {
  const { path = '', state = {}, ...rest } = props;

  const { localState } = useMobxHookForm(
    getMobxValue(state, path),
    state,
    path,
  );

  const onChange: any = action((e: React.ChangeEvent<HTMLInputElement>) => {
    localState.value = e.target.checked;
  });

  return (
    <NextUICheckbox
      {...rest}
      onChange={onChange}
      isSelected={localState.value}
    />
  );
}
