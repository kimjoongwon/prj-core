import {
  TimeInputProps as HeroUiTimeInputProps,
  TimeInput as NextUiTimeInput,
} from '@heroui/react';
import { MobxProps } from '@shared/types';
import { get, set } from 'lodash-es';
import { action, reaction } from 'mobx';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useEffect } from 'react';
import { parseAbsoluteToLocal, ZonedDateTime } from '@internationalized/date';

export interface TimeInputProps<T> extends HeroUiTimeInputProps, MobxProps<T> {}

export const TimeInput = observer(
  <T extends object>(props: TimeInputProps<T>) => {
    const { state, path, ...rest } = props;
    // @ts-ignore
    const defaultValue = (get(state, path) ||
      new Date().toISOString()) as string;

    const localState = useLocalObservable(() => ({
      value: parseAbsoluteToLocal(defaultValue),
    }));

    useEffect(() => {
      const disposer = reaction(
        () => localState.value,
        value => {
          set(state, path, value.toDate().toISOString());
        },
      );
      return disposer;
    }, []);

    return (
      <NextUiTimeInput
        {...rest}
        hideTimeZone
        value={localState.value}
        // @ts-ignore
        onChange={action(value => {
          // @ts-ignore
          localState.value = value as unknown as ZonedDateTime;
        })}
      />
    );
  },
);
