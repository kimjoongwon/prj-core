'use client';

import dayjs from 'dayjs';
import { range } from 'lodash-es';
import { Day } from './Day';
import { DaysOfWeek } from './DaysOfWeek';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { Button } from '@coc/ui';
import dayOfYear from 'dayjs/plugin/dayOfYear';
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
    calendarDate: dayjs().add(1, 'year'),
  }));

  const startDayOfMonthDay = localState.calendarDate.startOf('y').day();

  const endDayOfMonthDay = localState.calendarDate.endOf('M').day() - 1;

  const onClickNextMonth = () => {
    localState.calendarDate = localState.calendarDate.add(1, 'M');
  };

  const onClickPrevMonth = () => {
    localState.calendarDate = localState.calendarDate.subtract(1, 'M');
  };

  console.log(localState.calendarDate.daysInMonth());

  return (
    <div>
      <div className="flex">
        <Button onClick={onClickPrevMonth}>이전 달</Button>
        <div>{localState.calendarDate.month() + 1}월</div>
        <Button onClick={onClickNextMonth}>다음 달</Button>
      </div>
      <div className="grid grid-cols-7 grid-rows-6 gap-4">
        <DaysOfWeek />
        {range(0, 365).map(value => {
          const isVisible = value > startDayOfMonthDay;
          console.log('startDayOfMonthDay', startDayOfMonthDay);
          return (
            <Day
              state={state}
              day={
                isVisible
                  ? dayjs(localState.calendarDate)
                      .dayOfYear(value)
                      .format('YYYY-MM-DD')
                  : '-'
              }
              isVisible={isVisible}
            />
          );
        })}
      </div>
    </div>
  );
});
