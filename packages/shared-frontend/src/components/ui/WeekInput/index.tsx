'use client';

import React from 'react';
import { Days, WeekInputView, WeekInputViewProps } from './WeekInputView';
import { MobxProps } from '../types';
import { useMobxHookForm } from '../../../hooks';
import { get } from 'lodash-es';

interface WeekInputProps<T> extends WeekInputViewProps, MobxProps<T> {}

export const WeekInput = <T extends object>(props: WeekInputProps<T>) => {
  const { state, path, ...rest } = props;
  const initialValue = get(state, path);
  const { localState } = useMobxHookForm(initialValue, state, path);

  const onChange = (value: Days) => {
    localState.value = value;
  };

  return <WeekInputView {...rest} onChange={onChange} />;
};
