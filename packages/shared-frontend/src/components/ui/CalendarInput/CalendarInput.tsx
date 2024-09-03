'use client';

import dayjs from 'dayjs';
import { Day } from './Day';
import { DaysOfWeek } from './DaysOfWeek';
import { ButtonGroup } from '@nextui-org/react';
import { FcNext, FcPrevious } from 'react-icons/fc';
import { Button } from '../Button';
import { CalendarInputPropsView } from './_types';

export const CalendarInputView = <T extends object>(
  props: CalendarInputPropsView<T>,
) => {
  const {
    readOnly = false,
    onClickDay,
    currentMonthRange,
    month,
    year,
    prevMonthRange,
    nextMonthRange,
    onClickPrevMonth,
    onClickNextMonth,
    selectedDates,
  } = props;

  return (
    <div className="w-full">
      <div className="flex justify-between">
        <div className="flex space-x-2">
          <div className="text-2xl lg:text-4xl font-bold">{year}년</div>
          <div className="text-2xl lg:text-4xl font-bold">{month}월</div>
        </div>
        <ButtonGroup>
          <Button
            size="sm"
            variant="ghost"
            onClick={onClickPrevMonth}
            startContent={<FcPrevious />}
          >
            이전 달
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onClickNextMonth}
            endContent={<FcNext />}
          >
            다음 달
          </Button>
        </ButtonGroup>
      </div>
      <div className="grid grid-cols-7 mt-4">
        <DaysOfWeek />
      </div>
      <div className="grid grid-cols-7 grid-rows-6 gap-1">
        {prevMonthRange.map(value => (
          <Day readOnly={readOnly} key={value} day={value} />
        ))}
        {currentMonthRange.map(value => {
          return (
            <Day
              readOnly={readOnly}
              key={value}
              active
              selected={
                !!selectedDates.find((date: Date) =>
                  dayjs(date).isSame(dayjs(date).set('D', value), 'date'),
                )
              }
              day={value}
              onClickDay={onClickDay}
            />
          );
        })}
        {nextMonthRange.map(value => {
          return <Day readOnly={readOnly} key={value} day={value} />;
        })}
      </div>
    </div>
  );
};
