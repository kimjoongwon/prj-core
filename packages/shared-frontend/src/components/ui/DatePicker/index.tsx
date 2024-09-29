'use client';

import { get } from 'lodash-es';
import { useMobxHookForm } from '../../../hooks/useMobxHookForm';
import { MobxProps } from '../types';
import { DatePickerView, DatePickerViewProps } from './DatePickerView';
import {
  CalendarDate,
  DateValue,
  getLocalTimeZone,
} from '@internationalized/date';
import { observer, useLocalObservable } from 'mobx-react-lite';
import dayjs from 'dayjs';

interface DatePickerProps<T> extends DatePickerViewProps, MobxProps<T> {}

export const DatePicker = observer(
  <T extends object>(props: DatePickerProps<T>) => {
    const { state, path = '' } = props;
    //
    const initialISODate: any = get(state, path);
    const initialDateTime = new CalendarDate(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      new Date().getDate(),
    );
    const dateTimePickerState = useLocalObservable<{ value: DateValue }>(
      () => ({
        value: initialDateTime,
      }),
    );

    const { localState } = useMobxHookForm(initialISODate, state, path);

    const onChangeDate: DatePickerProps<T>['onChange'] = (
      dateValue: DateValue,
    ) => {
      localState.value = dateValue.toDate(getLocalTimeZone()).toISOString();
      dateTimePickerState.value = dateValue;
    };

    return (
      <DatePickerView
        {...props}
        onChange={onChangeDate}
        value={dateTimePickerState.value}
      />
    );
  },
);
