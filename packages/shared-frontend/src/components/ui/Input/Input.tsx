'use client';

import { ChangeEventHandler } from 'react';
import { MobxProps } from '../types';
import { InputProps as NextUIInputProps } from '@heroui/react';
import { useMobxHookForm } from '../../../hooks';
import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import { get } from 'lodash-es';
import { InputView } from './InputView';
import { Validation } from '@shared/specs';

export type InputProps<T> = MobxProps<T> &
  NextUIInputProps & {
    validation?: Validation;
  };

export const Input = observer(<T extends object>(props: InputProps<T>) => {
  const {
    path = '',
    state = {},
    onChange,
    onBlur,
    errorMessage = ' ',
    type,
    size = 'sm',
    validation,
    ...rest
  } = props;

  const initialValue = get(state, path) || '';

  const { localState } = useMobxHookForm(initialValue, state, path);

  const handleChange: ChangeEventHandler<HTMLInputElement> | undefined = action(
    e => {
      if (type === 'number' && typeof Number(e.target.value) === 'number') {
        return (localState.value = Number(e.target.value));
      }

      localState.value = e.target.value;
      onChange && onChange(localState.value);
    },
  );

  const handleOnBlur: NextUIInputProps['onBlur'] = e => {
    onBlur && onBlur(e.target.value as any);
  };

  return (
    <InputView
      {...rest}
      type={type}
      size={size}
      onChange={handleChange}
      onBlur={handleOnBlur}
      errorMessage={errorMessage}
      value={String(localState.value)}
    />
  );
});
