import { observer, useLocalObservable } from 'mobx-react-lite';
import {
  DateRangePicker as HeroUiDateRangePicker,
  DateRangePickerProps as HeroUiDateRangePickerProps,
} from '@heroui/react';
import { MobxProps } from '@shared/types';
import { get } from 'lodash-es';
import { parseAbsoluteToLocal } from '@internationalized/date';

export interface DateRangePickerProps<T extends object>
  extends HeroUiDateRangePickerProps,
    MobxProps<T> {}

export const DateRangePicker = observer(
  <T extends object>(props: DateRangePickerProps<T>) => {
    const { state, path = '', ...rest } = props;

    const startDateTime =
      get(state, (path as string)?.split(',')?.[0]) || new Date().toISOString();
    const endDateTime =
      get(state, (path as string)?.split(',')?.[1]) || new Date().toISOString();

    const localState = useLocalObservable(() => ({
      startDateTime: parseAbsoluteToLocal(startDateTime),
      endDateTime: parseAbsoluteToLocal(endDateTime),
    }));

    return (
      <HeroUiDateRangePicker
        hideTimeZone
        {...rest}
        defaultValue={{
          // @ts-ignore
          start: localState.startDateTime,
          // @ts-ignore
          end: localState.endDateTime,
        }}
      />
    );
  },
);
