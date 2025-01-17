import {
  DatePickerProps as HeroUiDatePickerProps,
  DatePicker as HeroUiDatePicker,
} from '@heroui/react';
import { parseAbsoluteToLocal } from '@internationalized/date';
import { MobxProps } from '@shared/types';
import { get } from 'lodash-es';
import { observer, useLocalObservable } from 'mobx-react-lite';

interface DatePickerProps<T> extends HeroUiDatePickerProps, MobxProps<T> {}

export const DatePicker = observer(
  <T extends object>(props: DatePickerProps<T>) => {
    const { state, path = '', ...rest } = props;
    const defaultValue = (get(state, path) ||
      new Date().toISOString()) as string;

    const localState = useLocalObservable(() => ({
      value: parseAbsoluteToLocal(defaultValue),
    }));

    return (
      <HeroUiDatePicker
        {...rest}
        hideTimeZone
        //   @ts-ignore
        value={localState.value}
        //   @ts-ignore
        onChange={value => (localState.value = value)}
      />
    );
  },
);
