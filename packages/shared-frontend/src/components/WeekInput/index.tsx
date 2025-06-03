'use client';

import { RecurringDayOfTheWeek, WeekInputView } from './WeekInputView';
import type { MobxProps } from '@shared/types';
import { get } from 'lodash-es';
import { observer } from 'mobx-react-lite';
import { useMobxHookForm } from '../../hooks';

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
