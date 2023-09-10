'use client';

import { ChangeEventHandler, ForwardedRef } from 'react';
import { MobxProps } from '../../types';
import {
  Input as NextUIInput,
  InputProps as NextUIInputProps,
} from '@nextui-org/react';
import { useMobxHookForm } from '../../hooks';
import { action } from 'mobx';
import { ValidationState } from '../controls/Validation/ValidationControl';
import { get } from 'lodash-es';

export type InputProps<T> = MobxProps<T> &
  NextUIInputProps & {
    validation?: ValidationState;
  };

export const BaseInput = <T extends any>(
  props: InputProps<T>,
  ref: ForwardedRef<HTMLInputElement>,
) => {
  const { path = '', state = {}, onChange, validation, ...rest } = props;

  const initialValue = get(state, path);

  const { localState } = useMobxHookForm(initialValue, state, path);

  const handleChange: ChangeEventHandler<HTMLInputElement> | undefined = action(
    e => {
      localState.value = e.target.value;

      onChange && onChange(e);
    },
  );

  return (
    <NextUIInput
      {...rest}
      ref={ref}
      onChange={handleChange}
      validationState={validation?.state}
      errorMessage={validation?.errorMessage}
      value={localState.value}
    />
  );
};
