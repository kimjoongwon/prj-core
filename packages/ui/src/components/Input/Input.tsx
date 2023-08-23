'use client';

import {
  ChangeEventHandler,
  ForwardedRef,
  RefObject,
  forwardRef,
  useEffect,
  useRef,
} from 'react';
import { getMobxValue } from '@kimjwally/utils';
import { MobxProps } from '../../types';
import {
  Input as NextUIInput,
  InputProps as NextUIInputProps,
} from '@nextui-org/react';
import { useMobxHookForm } from '../../hooks';

export type InputProps<T> = MobxProps<T> & NextUIInputProps;

export const BaseInput = <T extends any>(
  props: InputProps<T>,
  ref: ForwardedRef<HTMLInputElement>,
) => {
  const { path = '', state = {}, onChange, ...rest } = props;

  const initialValue = getMobxValue(state, path);

  const { localState } = useMobxHookForm(initialValue, state, path);

  const handleChange: ChangeEventHandler<HTMLInputElement> | undefined = e => {
    localState.value = e.target.value;

    onChange && onChange(e);
  };

  return (
    <NextUIInput
      {...rest}
      ref={ref}
      onChange={handleChange}
      value={localState.value}
    />
  );
};
