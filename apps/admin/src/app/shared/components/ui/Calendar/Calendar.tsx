'use client';

import dayjs from 'dayjs';
import { range } from 'lodash-es';
import { Day } from './Day';
import { DaysOfWeek } from './DaysOfWeek';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { Button } from '@coc/ui';
import dayOfYear from 'dayjs/plugin/dayOfYear';
import { ButtonGroup } from '@nextui-org/react';
import { FcNext, FcPrevious } from 'react-icons/fc';
const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THR', 'FRI', 'SAT'];

dayjs.extend(dayOfYear);

export interface CalendarProps {
  state: {
    startDate: Date;
    endDate: Date;
  };
  paths: string;
}

export const Calendar = observer((props: CalendarProps) => {
  const { paths, state } = props;

  const localState = useLocalObservable(() => ({
    calendarDate: dayjs(),
  }));

  const startDayOfMonthDay = localState.calendarDate.startOf('M').day();

  const endDayOfMonthDay = localState.calendarDate.endOf('M').day() - 1;

  const onClickNextMonth = () => {
    localState.calendarDate = localState.calendarDate.add(1, 'M');
  };

  const onClickPrevMonth = () => {
    localState.calendarDate = localState.calendarDate.subtract(1, 'M');
  };
  const prevMonth = localState.calendarDate.subtract(1, 'M');

  const prevMonthRange = range(
    prevMonth.daysInMonth(),
    prevMonth.daysInMonth() - startDayOfMonthDay,
  ).reverse();

  const currentMonthRange = range(1, localState.calendarDate.daysInMonth() + 1);

  const nextMonthRange = range(
    1,
    7 * 6 - (prevMonthRange.length + currentMonthRange.length) + 1,
  );

  return (
    <div className="w-full">
      <div className="flex flex-1 justify-between">
        <div className="flex space-x-2">
          <div className="text-4xl font-bold">
            {localState.calendarDate.year()}년
          </div>
          <div className="text-4xl font-bold">
            {localState.calendarDate.month() + 1}월
          </div>
        </div>
        <ButtonGroup>
          <Button
            variant="ghost"
            onClick={onClickPrevMonth}
            startContent={<FcPrevious />}
          >
            이전 달
          </Button>
          <Button
            variant="ghost"
            onClick={onClickNextMonth}
            endContent={<FcNext />}
          >
            다음 달
          </Button>
        </ButtonGroup>
      </div>
      <div className="grid grid-cols-7 gap-4 text-3xl font-bold text-right my-3">
        <DaysOfWeek />
      </div>
      <div className="grid grid-cols-7 grid-rows-6 gap-4">
        {prevMonthRange.map(value => (
          <Day state={state} day={value} />
        ))}
        {currentMonthRange.map(value => {
          return <Day active state={state} day={value} />;
        })}
        {nextMonthRange.map(value => {
          return <Day state={state} day={value} />;
        })}
      </div>
    </div>
  );
});
