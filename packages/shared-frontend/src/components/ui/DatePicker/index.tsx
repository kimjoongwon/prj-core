'use client';

import { get } from 'lodash-es';
import { useMobxHookForm } from '../../../hooks/useMobxHookForm';
import { MobxProps } from '../types';
import { DatePickerView, DatePickerViewProps } from './DatePickerView';
import {
  DateValue,
  getLocalTimeZone,
  parseDate,
} from '@internationalized/date';
import { observer } from 'mobx-react-lite';
import dayjs from 'dayjs';

interface DatePickerProps<T> extends DatePickerViewProps, MobxProps<T> {}

export const DatePicker = observer(
  <T extends object>(props: DatePickerProps<T>) => {
    const { state, path } = props;
    const initialValue: any = get(state, path);
    const initialDate = dayjs(initialValue).format('YYYY-MM-DD').toString();
    const { localState } = useMobxHookForm(initialDate, state, path);

    const onChangeDate: DatePickerProps<T>['onChange'] = (
      dateValue: DateValue,
    ) => {
      const date = dayjs(dateValue.toDate(getLocalTimeZone()).toISOString())
        .format('YYYY-MM-DD')
        .toString();
      localState.value = date;
    };

    return (
      <DatePickerView
        {...props}
        onChange={onChangeDate}
        value={parseDate(localState.value)}
      />
    );
  },
);
