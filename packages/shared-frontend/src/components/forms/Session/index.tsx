'use client';

import { Input } from '../../ui/Input';
import { VStack } from '../../ui/VStack';
import { DatePicker, HStack, Select, Text } from '../../ui';
import { observer } from 'mobx-react-lite';
import { useSessionForm } from './hooks/useSessionForm';
import { SessionDto } from '../../../model';
import { Divider } from '@nextui-org/react';

export interface SessionFormProps {
  state: Partial<SessionDto>;
}

export const SessionForm = observer((props: SessionFormProps) => {
  const { state } = props;
  const { repeatCycleTypeOptions, sessionTypeOptions } = useSessionForm();

  return (
    <VStack className="space-y-4">
      <Input label="세센명" state={state} path="name" />
      <Select
        options={sessionTypeOptions}
        label="세션 타입"
        state={state}
        path="type"
      />
      <Divider />
      <Text variant="h5" className="shrink-0">
        일회성 범위
      </Text>
      <HStack className="space-x-2">
        <DatePicker
          isDisabled={state.type === 'ONE_TIME_RANGE' ? false : true}
          label="시작 날짜 선택"
          state={state}
          path="startDate"
        />
        <DatePicker
          isDisabled={state.type === 'ONE_TIME_RANGE' ? false : true}
          label="종료 날짜 선택"
          state={state}
          path="endDate"
        />
      </HStack>

      <Divider />
      <Text variant="h5" className="shrink-0">
        일회성
      </Text>
      <DatePicker
        isDisabled={state.type === 'ONE_TIME' ? false : true}
        label="날짜 선택"
        state={state}
        path="startDate"
      />

      <Divider />
      <Text variant="h5" className="shrink-0">
        반복
      </Text>
      <VStack className="w-full space-y-2">
        <HStack className="flex-1 items-center space-x-4">
          <Input
            label="반복 주기"
            isDisabled={state.type === 'RECURRING' ? false : true}
            fullWidth={false}
            type="number"
            className="w-full"
            state={state}
            path="repeatCycle"
          />
          <Select
            label="반복 주기 타입"
            isDisabled={state.type === 'RECURRING' ? false : true}
            className="w-full"
            fullWidth={false}
            options={repeatCycleTypeOptions}
            state={state}
            path="repeatCycleType"
          />
        </HStack>
        <DatePicker
          label="시작 날짜 선택"
          state={state}
          path="startDate"
          isDisabled={state.type === 'RECURRING' ? false : true}
        />
        <DatePicker
          isDisabled={state.type === 'RECURRING' ? false : true}
          label="종료 날짜 선택"
          state={state}
          path="endDate"
        />
      </VStack>
    </VStack>
  );
});
