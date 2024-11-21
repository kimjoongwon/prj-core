'use client';

import { ChangeEventHandler } from 'react';
import { MobxProps } from '../types';
import { InputProps as NextUIInputProps } from '@nextui-org/react';
import { useMobxHookForm } from '../../../hooks';
import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import { get } from 'lodash-es';
import { InputView } from './InputView';

export type InputProps<T> = MobxProps<T> & NextUIInputProps;

export const Input = observer(<T extends object>(props: InputProps<T>) => {
  const { path = '', state = {}, onChange, type, ...rest } = props;

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

  return (
    <InputView
      {...rest}
      type={type}
      onChange={handleChange}
      onBlur={e => {
        rest?.onBlur?.(e.target.value);
      }}
      value={String(localState.value)}
    />
  );
});

Input.displayName = 'Input';
