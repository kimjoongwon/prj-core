import {
  DatePickerProps as HeroUiDatePickerProps,
  DatePicker as HeroUiDatePicker,
} from '@heroui/react';
import { parseAbsoluteToLocal } from '@internationalized/date';
import { MobxProps } from '@shared/types';
import { get, set } from 'lodash-es';
import { reaction } from 'mobx';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useEffect } from 'react';

interface DatePickerProps<T> extends HeroUiDatePickerProps, MobxProps<T> {}

export const DatePicker = observer(
  <T extends object>(props: DatePickerProps<T>) => {
    const { state, path = '', ...rest } = props;
    // @ts-ignore
    const defaultValue = (get(state, path) ||
      new Date().toISOString()) as string;

    const localState = useLocalObservable(() => ({
      value: parseAbsoluteToLocal(defaultValue),
    }));

    useEffect(() => {
      const disposer = reaction(
        () => localState.value,
        () => {
          set(state, path, localState.value.toAbsoluteString());
        },
      );

      return disposer;
    });

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
