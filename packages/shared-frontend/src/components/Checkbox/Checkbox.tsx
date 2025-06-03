import { action } from 'mobx';
import { useMobxHookForm } from '../../hooks';
import { MobxProps } from '@shared/types';
import {
  Checkbox as NextUICheckbox,
  CheckboxProps as NextUICheckboxProps,
} from "@heroui/react";
import { get } from 'lodash-es';
import { Text } from '../Text';

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
      size="lg"
      isSelected={localState.value}
    >
      <Text className="font-bold">{props.children}</Text>
    </NextUICheckbox>
  );
}
