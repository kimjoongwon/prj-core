import React from 'react';
import { HStack } from '../HStack';
import { Text } from '../Text';
import { VStack } from '../VStack';
// import { RecurringDayOfTheWeek } from '../../../model/recurringDayOfTheWeek';
import { Chip } from '@heroui/chip';
import { observer } from 'mobx-react-lite';

export enum RecurringDayOfTheWeek {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}

export interface WeekInputViewProps {
  onChange: (value: RecurringDayOfTheWeek) => void;
  value: RecurringDayOfTheWeek;
  disabled?: boolean;
}

export const WeekInputView = observer((props: WeekInputViewProps) => {
  const { onChange, value } = props;
  const dayOptions: {
    text: string;
    value: RecurringDayOfTheWeek;
  }[] = [
    {
      text: '월',
      value: RecurringDayOfTheWeek.MONDAY,
    },
    {
      text: '화',
      value: RecurringDayOfTheWeek.TUESDAY,
    },
    {
      text: '수',
      value: RecurringDayOfTheWeek.WEDNESDAY,
    },
    {
      text: '목',
      value: RecurringDayOfTheWeek.THURSDAY,
    },
    {
      text: '금',
      value: RecurringDayOfTheWeek.FRIDAY,
    },
    {
      text: '토',
      value: RecurringDayOfTheWeek.SATURDAY,
    },
    {
      text: '일',
      value: RecurringDayOfTheWeek.SUNDAY,
    },
  ];

  return (
    <VStack className="space-y-2">
      <Text variant="caption">반복 요일</Text>
      <HStack className="space-x-2">
        {dayOptions.map(day => {
          return (
            <Chip
              className="cursor-pointer"
              onClick={() => onChange(day.value)}
              key={day.value}
              color={value === day.value ? 'primary' : 'default'}
            >
              {day.text}
            </Chip>
          );
        })}
      </HStack>
    </VStack>
  );
});
