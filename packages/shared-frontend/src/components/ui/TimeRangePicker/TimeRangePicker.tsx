'use client';

import dayjs from 'dayjs';
import { get } from 'lodash-es';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useMobxHookForm } from '../../../hooks/useMobxHookForm';
import { MobxProps } from '../types';
import { TimeInput, TimeInputProps, TimeInputValue } from '@nextui-org/react';
import { HStack } from '../HStack';
import { Time } from '@internationalized/date';

interface TimeRangePickerProps<T> extends MobxProps<T> {
  startTimePath?: string;
  endTimePath?: string;
  baseDate?: Date;
}

export const TimeRangePicker = observer(
  <T extends object>(props: TimeRangePickerProps<T>) => {
    const { startTimePath = '', endTimePath = '', state = {} } = props;

    const initialStartTime = dayjs(get(state, startTimePath));
    const startHour = initialStartTime.hour();
    const startMinute = initialStartTime.minute();

    const initialEndTime = dayjs(get(state, endTimePath));
    const endHour = initialEndTime.hour();
    const endMinute = initialEndTime.minute();

    const localState = useLocalObservable<{
      startTime: TimeInputValue | undefined;
      endTime: TimeInputValue | undefined;
    }>(() => ({
      startTime: new Time(startHour, startMinute),
      endTime: new Time(endHour, endMinute),
    }));

    const { localState: localStartTimeState } = useMobxHookForm(
      initialStartTime,
      state,
      startTimePath,
    );

    const { localState: localEndTimeState } = useMobxHookForm(
      initialEndTime,
      state,
      endTimePath,
    );

    const handleStartTimeChange: TimeInputProps['onChange'] = value => {
      const date = dayjs()
        .set('hour', value.hour)
        .set('minute', value.minute)
        .toDate();
      localStartTimeState.value = date;
    };

    const handleEndTimeChange: TimeInputProps['onChange'] = value => {
      const date = dayjs()
        .set('hour', value.hour)
        .set('minute', value.minute)
        .toDate();
      localEndTimeState.value = date;
    };

    return (
      <HStack className="space-x-2">
        <TimeInput
          label="시작시간"
          onChange={handleStartTimeChange}
          value={localState.startTime}
        />
        <TimeInput
          label="종료시간"
          onChange={handleEndTimeChange}
          value={localState.endTime}
        />
      </HStack>
    );
  },
);
