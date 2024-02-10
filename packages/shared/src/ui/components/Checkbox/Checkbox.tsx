import { action } from 'mobx';
import { useMobxHookForm } from '../../../hooks';
import { MobxProps } from '../../../model';
import {
  Checkbox as NextUICheckbox,
  CheckboxProps as NextUICheckboxProps,
} from '@nextui-org/react';
import { get } from 'lodash-es';

export interface CheckboxProps<T> extends MobxProps<T>, NextUICheckboxProps {}

export function BaseCheckbox<T extends object>(props: CheckboxProps<T>) {
  const { path = '', state = {}, ...rest } = props;

  const { localState } = useMobxHookForm(get(state, path), state, path);

  const onChange: any = action((e: React.ChangeEvent<HTMLInputElement>) => {
    localState.value = e.target.checked;
  });

  return (
    <NextUICheckbox
      {...rest}
      onChange={onChange}
      size='lg'
      isSelected={localState.value}
    />
  );
}
