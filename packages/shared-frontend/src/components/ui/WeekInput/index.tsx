'use client';

import React from 'react';
import { WeekInputView } from './WeekInputView';
import { MobxProps } from '../types';
import { useMobxHookForm } from '../../../hooks';
import { get, isArray } from 'lodash-es';
import { RecurringDayOfTheWeek } from '../../../model';
import { observer } from 'mobx-react-lite';

interface WeekInputProps<T> extends MobxProps<T> {}

export const WeekInput = observer(
  <T extends object>(props: WeekInputProps<T>) => {
    const { state, path, ...rest } = props;
    const initialValue = get(state, path);
    const { localState } = useMobxHookForm(initialValue, state, path);

    if (!isArray(localState.value)) {
      throw new Error('배열을 이용해주세요.');
    }

    // 포함되어 있으면 제거하고 포함되어 있지 않으면 넣는다.
    const onChange = (value: RecurringDayOfTheWeek) => {
      if (localState.value.includes(value)) {
        localState.value = localState.value.filter(v => v !== value);
      } else {
        localState.value = [...localState.value, value];
      }
    };

    return (
      <WeekInputView {...rest} onChange={onChange} value={localState.value} />
    );
  },
);
