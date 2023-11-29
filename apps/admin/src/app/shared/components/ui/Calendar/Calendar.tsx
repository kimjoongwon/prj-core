'use client';

import dayjs from 'dayjs';
import { range } from 'lodash-es';
import { Day } from './Day';
import { DaysOfWeek } from './DaysOfWeek';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { Button } from '@coc/ui';
import { ButtonGroup } from '@nextui-org/react';
import { FcNext, FcPrevious } from 'react-icons/fc';
import { action, get, reaction, set } from 'mobx';
import { useEffect } from 'react';

export interface CalendarProps<T> {
  state: T;
  path: string;
}

export interface CalendarLocalState {
  calendarDate: dayjs.Dayjs;
  selectedDate: Date;
}

export const Calendar = observer(
  <T extends object>(props: CalendarProps<T>) => {
    const { state = {}, path = '' } = props;
    const localState = useLocalObservable(() => ({
      calendarDate: dayjs(),
    }));

    useEffect(() => {
      const disposer = reaction(
        () => localState.calendarDate,
        () => {
          console.log('??');
          console.log(state, path);
          set(state, path, localState.calendarDate.toDate());
          console.log(get(state, path));
        },
      );

      return () => disposer();
    }, []);

    useEffect(() => {
      const disposer = reaction(
        () => get(state, path),
        value => {
          localState.calendarDate = value;
        },
      );

      return () => disposer();
    }, []);

    const startDayOfMonthDay = dayjs(localState.calendarDate)
      .startOf('M')
      .day();

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

    const currentMonthRange = range(
      1,
      localState.calendarDate.daysInMonth() + 1,
    );

    const nextMonthRange = range(
      1,
      7 * 6 - (prevMonthRange.length + currentMonthRange.length) + 1,
    );

    const onClickDay = action((day: number) => {
      localState.calendarDate = localState.calendarDate.set('D', day);
    });

    return (
      <div className="w-full">
        <div className="flex justify-between">
          <div className="flex space-x-2">
            <div className="text-2xl lg:text-4xl font-bold">
              {localState.calendarDate.year()}년
            </div>
            <div className="text-2xl lg:text-4xl font-bold">
              {localState.calendarDate.month() + 1}월
            </div>
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
            <Day key={value} day={value} />
          ))}
          {currentMonthRange.map(value => {
            return (
              <Day
                key={value}
                active
                selected={localState.calendarDate.get('D') === value}
                day={value}
                onClickDay={() => onClickDay(value)}
              />
            );
          })}
          {nextMonthRange.map(value => {
            return <Day key={value} day={value} />;
          })}
        </div>
      </div>
    );
  },
);
