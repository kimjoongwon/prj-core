'use client';

import { ChangeEventHandler } from 'react';
import { MobxProps } from '../../../model';
import { ValidationState } from '../controls/Form/FormControl';
import { InputView } from './InputView';
import { InputProps as NextUIInputProps } from '@nextui-org/react';
import { useMobxHookForm } from '../../../hooks';
import { action, get } from 'mobx';
import { observer } from 'mobx-react-lite';

export type InputProps<T> = MobxProps<T> &
  NextUIInputProps & {
    validation?: ValidationState;
  };

function Input<T extends object>(props: InputProps<T>) {
  const { path = '', state = {}, onChange, validation, type } = props;

  const initialValue = get(state, path);

  const { localState } = useMobxHookForm(initialValue, state, path);

  const handleChange:
    | ChangeEventHandler<HTMLInputElement>
    | undefined = action(e => {
    if (
      type === 'number' &&
      typeof Number(e.target.value) === 'number'
    ) {
      return (localState.value = Number(e.target.value));
    }

    localState.value = e.target.value;

    onChange && onChange(e);
  });

  return (
    <InputView
      {...props}
      onChange={handleChange}
      value={String(localState.value)}
      isInvalid={validation?.isInvalid}
      errorMessage={validation?.errorMessage}
    />
  );
}

export default observer(Input);
