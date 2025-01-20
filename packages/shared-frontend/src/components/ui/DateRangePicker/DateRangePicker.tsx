import { observer, useLocalObservable } from 'mobx-react-lite';
import {
  DateRangePicker as HeroUiDateRangePicker,
  DateRangePickerProps as HeroUiDateRangePickerProps,
} from '@heroui/react';
import { MobxProps } from '@shared/types';
import { get, set } from 'lodash-es';
import { parseAbsoluteToLocal } from '@internationalized/date';
import { useEffect } from 'react';
import { reaction } from 'mobx';

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

    console.log('path', path);

    useEffect(() => {
      const disposer = reaction(
        () => JSON.stringify(localState),
        () => {
          console.log(
            'newState.startDateTime',
            localState.startDateTime.toAbsoluteString(),
          );
          set(
            state,
            (path as string)?.split(',')?.[0],
            localState.startDateTime.toAbsoluteString(),
          );
          set(
            state,
            (path as string)?.split(',')?.[1],
            localState.endDateTime.toAbsoluteString(),
          );
        },
      );

      return disposer;
    }, []);

    return (
      <HeroUiDateRangePicker
        hideTimeZone
        {...rest}
        onChange={value => {
          localState.startDateTime = value.start;
          localState.endDateTime = value.end;
        }}
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
