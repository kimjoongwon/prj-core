'use client';
import dayjs from 'dayjs';
import { get } from 'lodash-es';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useMobxHookForm } from '../../../hooks/useMobxHookForm';
import { MobxProps } from '../types';
import { TimeInput, TimeInputProps } from '@nextui-org/react';
import { VStack } from '../VStack';
import { HStack } from '../HStack';

interface TimeRangePickerProps<T> extends MobxProps<T> {
  startTimePath?: string;
  endTimePath?: string;
  baseDate?: Date;
}

export const TimeRangePicker = observer(
  <T extends object>(props: TimeRangePickerProps<T>) => {
    const {
      baseDate = new Date(),
      startTimePath = '',
      endTimePath = '',
      state = {},
    } = props;

    const initialStartTime = get(state, startTimePath) || baseDate;
    const initialEndTime = get(state, endTimePath) || baseDate;

    const localState = useLocalObservable(() => ({
      errorMessage: '',
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
        <TimeInput label="시작시간" onChange={handleStartTimeChange} />
        <TimeInput label="종료시간" onChange={handleEndTimeChange} />
      </HStack>
    );
  },
);
