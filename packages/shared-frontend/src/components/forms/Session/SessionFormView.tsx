'use client';

import { Select } from '../../ui/Select';
import { Input } from '../../ui/Input';
import { VStack } from '../../ui/VStack';
import { CalendarInput, Checkbox, DatePicker, HStack, Text } from '../../ui';
import { observer } from 'mobx-react-lite';
import { Divider } from '@nextui-org/react';
import { useProps } from './hooks/useProps';
import { WeekInput } from '../../ui/WeekInput';

export const SessionFormView = observer(
  (props: ReturnType<typeof useProps>) => {
    const { repeatCycleTypeOptions, sessionTypeOptions, state } = props;

    return (
      <VStack className="space-y-4">
        <div className="w-full">
          <CalendarInput state={state} path="timelineDates" />
        </div>
        <Divider />
        <HStack className="space-x-2">
          <Input label="세센명" state={state} path="name" />
          <Select
            options={sessionTypeOptions}
            label="세션 타입"
            state={state}
            path="type"
          />
        </HStack>
        {state.type === 'ONE_TIME' && (
          <VStack className="space-y-2">
            <Checkbox state={state} path="rangeMode">
              범위
            </Checkbox>
            {state.rangeMode ? (
              <HStack className="space-x-2">
                <DatePicker
                  label="시작 날짜 선택"
                  state={state}
                  path="oneTime.startDete"
                />
                <DatePicker
                  label="종료 날짜 선택"
                  state={state}
                  path="oneTime.endDate"
                />
              </HStack>
            ) : (
              <DatePicker label="날짜 선택" state={state} path="oneTime.date" />
            )}
          </VStack>
        )}
        {state.type === 'RECURRING' && (
          <VStack className="space-y-2">
            <DatePicker state={state} path="baseDate" />
            <HStack className="w-1/2 items-center space-x-4">
              <Text variant="caption">반복 주기 : </Text>
              <Input
                fullWidth={false}
                type="number"
                className="w-[100px]"
                state={state}
                path="repeatCycle"
              />
              <Select
                className="w-[100px]"
                fullWidth={false}
                options={repeatCycleTypeOptions}
                state={state}
                path="repeatCycleType"
              />
            </HStack>
            <WeekInput state={state} path={'recurringDayOfTheWeek'} />
            <DatePicker state={state} path="endDate" />
          </VStack>
        )}
      </VStack>
    );
  },
);
