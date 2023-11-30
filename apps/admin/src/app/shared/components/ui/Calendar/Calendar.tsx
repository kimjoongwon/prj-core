'use client';

import dayjs from 'dayjs';
import { get, range, set } from 'lodash-es';
import { Day } from './Day';
import { DaysOfWeek } from './DaysOfWeek';
import { useLocalObservable } from 'mobx-react-lite';
import { Button } from '@coc/ui';
import { ButtonGroup } from '@nextui-org/react';
import { FcNext, FcPrevious } from 'react-icons/fc';
import { action, reaction } from 'mobx';
import { useEffect } from 'react';

export interface CalendarProps<T> {
  state: T;
  path: string;
}

export interface CalendarLocalState {
  calendarDate: Date;
  values: Date[];
}

export const Calendar = <T extends object>(props: CalendarProps<T>) => {
  const { state = {}, path = '' } = props;
  const localState = useLocalObservable<CalendarLocalState>(() => ({
    calendarDate: dayjs().startOf('D').toDate(),
    values: [],
  }));

  useEffect(() => {
    const disposer = reaction(
      () => localState.values,
      () => {
        set(state, path, localState.values);
      },
    );

    return () => disposer();
  }, []);

  useEffect(() => {
    const disposer = reaction(
      () => get(state, path),
      values => {
        localState.values = values;
      },
    );

    return () => disposer();
  }, []);

  const startDayOfMonthDay = dayjs(localState.calendarDate).startOf('M').day();

  const onClickNextMonth = () => {
    localState.calendarDate = dayjs(localState.calendarDate)
      .add(1, 'M')
      .toDate();
  };

  const onClickPrevMonth = () => {
    localState.calendarDate = dayjs(localState.calendarDate)
      .subtract(1, 'M')
      .toDate();
  };
  const prevMonth = dayjs(localState.calendarDate).subtract(1, 'M');

  const prevMonthRange = range(
    prevMonth.daysInMonth(),
    prevMonth.daysInMonth() - startDayOfMonthDay,
  ).reverse();

  const currentMonthRange = range(
    1,
    dayjs(localState.calendarDate).daysInMonth() + 1,
  );

  const nextMonthRange = range(
    1,
    7 * 6 - (prevMonthRange.length + currentMonthRange.length) + 1,
  );

  const onClickDay = action((day: number) => {
    if (
      localState.values.some((date: Date) => {
        return dayjs(date).isSame(
          dayjs(localState.calendarDate).set('D', day),
          'date',
        );
      })
    ) {
      const values = localState.values.filter((date: Date) => {
        return !dayjs(date).isSame(
          dayjs(localState.calendarDate).set('D', day),
          'date',
        );
      });
      localState.values = values;
      return;
    }

    localState.values = [
      ...localState.values,
      dayjs(localState.calendarDate).set('D', day).toDate(),
    ];
  });

  console.log('localState.values', localState.values);

  return (
    <div className="w-full">
      <div className="flex justify-between">
        <div className="flex space-x-2">
          <div className="text-2xl lg:text-4xl font-bold">
            {dayjs(localState.calendarDate).year()}년
          </div>
          <div className="text-2xl lg:text-4xl font-bold">
            {dayjs(localState.calendarDate).month() + 1}월
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
              selected={
                !!localState.values.find((date: Date) =>
                  dayjs(date).isSame(
                    dayjs(localState.calendarDate).set('D', value),
                    'date',
                  ),
                )
              }
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
};
