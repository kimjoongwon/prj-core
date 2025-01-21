'use client';

import React from 'react';
import { WeekInputView } from './WeekInputView';
import { MobxProps } from '../types';
import { useMobxHookForm } from '../../../hooks';
import { get, isArray } from 'lodash-es';
import { RecurringDayOfTheWeek } from '../../../model';
import { observer } from 'mobx-react-lite';

interface WeekInputProps<T> extends MobxProps<T> {
  disabled?: boolean;
}

export const WeekInput = observer(
  <T extends object>(props: WeekInputProps<T>) => {
    const { state, path, ...rest } = props;
    const initialValue = get(state, path);
    const { localState } = useMobxHookForm(initialValue, state, path);

    const onChange = (value: RecurringDayOfTheWeek) => {
      localState.value = value;
    };

    return (
      <WeekInputView {...rest} onChange={onChange} value={localState.value} />
    );
  },
);
