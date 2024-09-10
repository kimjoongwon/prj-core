'use client';

import React from 'react';
import { Days, WeekInputView } from './WeekInputView';
import { MobxProps } from '../types';
import { useMobxHookForm } from '../../../hooks';
import { get, isArray } from 'lodash-es';

interface WeekInputProps<T> extends MobxProps<T> {}

export const WeekInput = <T extends object>(props: WeekInputProps<T>) => {
  const { state, path, ...rest } = props;
  const initialValue = get(state, path);
  const { localState } = useMobxHookForm(initialValue, state, path);

  if (!isArray(localState.value)) {
    throw new Error('배열을 이용해주세요.');
  }
  const onChange = (value: Days) => {
    localState.value.push(value);
  };

  return <WeekInputView {...rest} onChange={onChange} />;
};
