import React from 'react';
import { Chip } from '../Chip';
import { HStack } from '../HStack';
import { Text } from '../Text';
import { VStack } from '../VStack';

export interface WeekInputViewProps {
  onChange: (value: Days) => void;
}

export enum Days {
  MON = 'mon',
  TUE = 'tue',
  WED = 'wed',
  THU = 'thu',
  FRI = 'fri',
  SAT = 'sat',
  SUN = 'sun',
}

export const WeekInputView = (props: WeekInputViewProps) => {
  const { onChange } = props;
  const dayOptions: {
    text: string;
    value: Days;
  }[] = [
    {
      text: '월',
      value: Days.MON,
    },
    {
      text: '화',
      value: Days.TUE,
    },
    {
      text: '수',
      value: Days.WED,
    },
    {
      text: '목',
      value: Days.THU,
    },
    {
      text: '금',
      value: Days.FRI,
    },
    {
      text: '토',
      value: Days.SAT,
    },
    {
      text: '일',
      value: Days.SUN,
    },
  ];

  return (
    <VStack className="space-y-2">
      <Text variant="caption">반복 요일</Text>
      <HStack className="space-x-2">
        {dayOptions.map(day => {
          return (
            <Chip key={day.value} onChange={() => onChange(day.value)}>
              {day.text}
            </Chip>
          );
        })}
      </HStack>
    </VStack>
  );
};
