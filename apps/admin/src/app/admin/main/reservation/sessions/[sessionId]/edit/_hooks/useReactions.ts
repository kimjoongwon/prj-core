import { useEffect } from 'react';
import { useState } from './useState';
import { reaction } from 'mobx';
import dayjs from 'dayjs';
import { RecurringDayOfTheWeek } from '@shared/frontend';

export const useReactions = (context: {
  state: ReturnType<typeof useState>;
}) => {
  const { state } = context;
  //   initial reaction
  useEffect(() => {
    const disposer = reaction(
      () => state.form.type,
      () => {
        console.log('type init');
        state.form.startDate = null;
        state.form.endDate = null;
        state.form.repeatCycle = 1;
      },
    );

    return disposer;
  }, []);

  useEffect(() => {
    const convertRecurringDayToNumber = (
      day: RecurringDayOfTheWeek,
    ): number => {
      switch (day) {
        case RecurringDayOfTheWeek.SUNDAY:
          return 0;
        case RecurringDayOfTheWeek.MONDAY:
          return 1;
        case RecurringDayOfTheWeek.TUESDAY:
          return 2;
        case RecurringDayOfTheWeek.WEDNESDAY:
          return 3;
        case RecurringDayOfTheWeek.THURSDAY:
          return 4;
        case RecurringDayOfTheWeek.FRIDAY:
          return 5;
        case RecurringDayOfTheWeek.SATURDAY:
          return 6;
        default:
          throw new Error(`Invalid day: ${day}`);
      }
    };
    const disposer = reaction(
      () => state.form.startDate,
      () => {
        if (state.form.type === 'ONE_TIME') {
          state.timelineDates = [state.form.startDate as string];
        }

        if (state.form.type === 'ONE_TIME_RANGE') {
          state.timelineDates = [
            state.form.startDate as string,
            state.form.endDate as string,
          ];
        }

        if (state.form.type === 'RECURRING') {
          if (state.form.repeatCycleType === 'WEEK') {
            const startDate = dayjs(state.form.startDate);
            const repeatCycle = state.form.repeatCycle || 1;
            const recurringDays: RecurringDayOfTheWeek[] =
              state.form.recurringDayOfTheWeek || [];

            // 현재 날짜부터 1년 동안의 반복 날짜 생성
            const endDate = startDate.add(1, 'year');
            let currentDate = startDate;

            while (currentDate.isBefore(endDate)) {
              recurringDays.forEach(day => {
                const nextDate = currentDate.day(
                  convertRecurringDayToNumber(day),
                );
                if (nextDate.isAfter(currentDate)) {
                  state.timelineDates.push(nextDate.format('YYYY-MM-DD'));
                }
              });
              currentDate = currentDate.add(repeatCycle, 'week');
            }
          }
        }
      },
    );

    return disposer;
  }, []);
};
