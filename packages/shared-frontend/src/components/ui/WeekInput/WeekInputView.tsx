import React from 'react';
import { HStack } from '../HStack';
import { Text } from '../Text';
import { VStack } from '../VStack';
import { RecurringDayOfTheWeek } from '../../../model/recurringDayOfTheWeek';
import { Chip } from '@mui/material';
import { observer } from 'mobx-react-lite';

export interface WeekInputViewProps {
  onChange: (value: RecurringDayOfTheWeek) => void;
  value: RecurringDayOfTheWeek[];
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
  console.log('value', value);
  return (
    <VStack className="space-y-2">
      <Text variant="caption">반복 요일</Text>
      <HStack className="space-x-2">
        {dayOptions.map(day => {
          return (
            <Chip
              onClick={() => onChange(day.value)}
              key={day.value}
              clickable
              color={value.includes(day.value) ? 'primary' : 'default'}
              label={day.text}
            />
          );
        })}
      </HStack>
    </VStack>
  );
});
