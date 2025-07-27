import React from 'react';
import { Chip } from '@heroui/chip';
import { observer } from 'mobx-react-lite';
import { RecurringDayOfTheWeek } from '@shared/types';
import { VStack, Text, HStack } from '../../ui';

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
      value: 'MONDAY',
    },
    {
      text: '화',
      value: 'TUESDAY',
    },
    {
      text: '수',
      value: 'WEDNESDAY',
    },
    {
      text: '목',
      value: 'THURSDAY',
    },
    {
      text: '금',
      value: 'FRIDAY',
    },
    {
      text: '토',
      value: 'SATURDAY',
    },
    {
      text: '일',
      value: 'SUNDAY',
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
