'use client';

import { get } from 'lodash-es';
import { useMobxHookForm } from '../../../hooks/useMobxHookForm';
import { MobxProps } from '../types';
import { DatePickerView, DatePickerViewProps } from './DatePickerView';
import { CalendarDate, DateValue } from '@internationalized/date';
import { observer } from 'mobx-react-lite';

interface DatePickerProps<T> extends DatePickerViewProps, MobxProps<T> {}

export const DatePicker = observer(
  <T extends object>(props: DatePickerProps<T>) => {
    const { state, path = '' } = props;

    const initialISODate: any = get(state, path);

    const { localState } = useMobxHookForm(initialISODate, state, path);

    const onChangeDate: DatePickerProps<T>['onChange'] = (
      dateValue: DateValue,
    ) => {
      localState.value = dateValue;
    };

    const value = new CalendarDate(
      new Date(localState.value).getFullYear(),
      new Date(localState.value).getMonth() + 1,
      new Date(localState.value).getDate(),
    );

    return <DatePickerView {...props} onChange={onChangeDate} value={value} />;
  },
);
