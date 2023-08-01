'use client';

import React, { useEffect, useId } from 'react';
import { reaction } from 'mobx';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { getMobxValue, setMobxValue } from '@kimjwally/utils';
import { MobxProps } from '../../types';
import {
  Input as NextUIInput,
  InputProps as NextUIInputProps,
} from '@nextui-org/react';
import { useMobxHookForm } from '../../hooks';

export type InputProps<T> = MobxProps<T> & NextUIInputProps;

function _Input<T extends object>(props: InputProps<T>) {
  const { path = '', state = {}, ...rest } = props;

  const initialValue = getMobxValue(state, path);

  const { localState } = useMobxHookForm(initialValue, state, path);
  // const localState = useLocalObservable(() => ({
  //   value: initialValue,
  // }));

  // useEffect(() => {
  //   const setterDisposer = reaction(
  //     () => localState.value,
  //     value => setMobxValue(state, path, value),
  //   );

  //   const getterDisposer = reaction(
  //     () => getMobxValue(state, path),
  //     value => {
  //       localState.value = value;
  //     },
  //   );

  //   return () => {
  //     setterDisposer();
  //     getterDisposer();
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    localState.value = e.target.value;
  };

  return (
    <NextUIInput
      {...rest}
      id={useId()}
      onChange={onChange}
      value={localState.value}
    />
  );
}

export const Input = observer(_Input);
