import { observer } from 'mobx-react-lite';
import { action } from 'mobx';
import { getMobxValue } from '@kimjwally/utils';
import { useMobxHookForm } from '../../hooks';
import { MobxProps } from '../../types';
import {
  Radio,
  RadioGroup as NextUIRadioGroup,
  RadioGroupProps,
} from '@nextui-org/react';

interface RadioOption {
  text: string;
  value: any;
}
interface CocRadioGroupProps<T> extends MobxProps<T>, RadioGroupProps {
  options?: RadioOption[];
}

function _RadioGroup<T extends object>(props: CocRadioGroupProps<T>) {
  const {
    options = [
      {
        text: 'test',
        value: 'test',
      },
      {
        text: 'test2',
        value: 'test2',
      },
    ],
    state = {},
    path = '',
    ...rest
  } = props;

  const initialValue =
    options?.find(option => option.value === getMobxValue(state, path))
      ?.value || '';

  const { localState } = useMobxHookForm(initialValue, state, path);

  const onChangeValue = action((checked: string) => {
    localState.value = checked;
  });

  return (
    <NextUIRadioGroup
      {...rest}
      value={localState.value}
      onValueChange={onChangeValue}
    >
      {options.map(option => (
        <Radio key={option.value} value={option.value}>
          {option.text}
        </Radio>
      ))}
    </NextUIRadioGroup>
  );
}

export const RadioGroup = observer(_RadioGroup);
