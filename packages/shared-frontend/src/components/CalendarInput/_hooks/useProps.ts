import { useContext } from './useContext';
import { CalendarInputProps } from '@shared/types';
import { useState } from './useState';
import dayjs from 'dayjs';
import { range, uniq } from 'lodash-es';
import { DAY_OF_WEEK, WEEK_OF_MONTH } from '../_constants';

export const useProps = <T extends object>(props: CalendarInputProps<T>) => {
  const context = useContext<T>(props);
  const state = useState({
    context,
  });

  // @ts-ignore
  const calendarInputHeaderDate = state.calendarInput.header.date;
  // 요일(월, 화, 수 등등)
  const startDateOfMonth = dayjs(calendarInputHeaderDate)
    .startOf('month')
    .date();

  const endDateOfMonth = dayjs(calendarInputHeaderDate).endOf('month').date();
  const startDayOfMonth = dayjs(calendarInputHeaderDate).startOf('month').day();

  const prevMonthDayJs = dayjs(calendarInputHeaderDate).subtract(1, 'month');
  const nextMonthDayJs = dayjs(calendarInputHeaderDate).add(1, 'month');

  const endDateOfPrevMonth = prevMonthDayJs.endOf('month').date();

  const prevMonthRange = range(
    endDateOfPrevMonth - startDayOfMonth,
    endDateOfPrevMonth,
  );

  const IncludeRangeEnd = 1;
  // range(1, 30)
  // [1, 2, 3, 4, 5, 6, 7, ..., 29]
  const currentMonth = range(
    startDateOfMonth,
    endDateOfMonth + IncludeRangeEnd,
  );

  const nextMonthRange = range(
    1,
    DAY_OF_WEEK * WEEK_OF_MONTH -
      (prevMonthRange.length + currentMonth.length) +
      IncludeRangeEnd,
  );

  const convertToDateModel = (
    date: Date,
    type: 'prev' | 'current' | 'next',
  ) => {
    // @ts-ignore
    const isSelected = state.value.some(value => {
      return dayjs(value).isSame(date, 'date');
    });

    return {
      value: date.toISOString(),
      selected: isSelected,
      selectDate() {
        // @ts-ignore
        const isSelected = state.value.some(date => {
          return dayjs(date).isSame(this.value, 'date');
        });

        if (isSelected) {
          // @ts-ignore
          state.value = state.value.filter(date => {
            return !dayjs(date).isSame(this.value, 'date');
          });
        } else {
          // @ts-ignore
          state.value = uniq([...state.value, this.value]);
        }
        this.selected = !this.selected;
      },
      isPressable: type === 'current' ? true : false,
      className: type === 'current' ? 'text-black' : 'text-gray-400',
    };
  };

  const prevMonthDates = prevMonthRange
    .map(value => dayjs(prevMonthDayJs).set('date', value).toDate())
    .map((date: Date) => convertToDateModel(date, 'prev'));

  const currentMonthDates = currentMonth
    .map(value => dayjs(calendarInputHeaderDate).set('date', value).toDate())
    .map((date: Date) => convertToDateModel(date, 'current'));

  const nextMonthDates = nextMonthRange
    .map(value => dayjs(nextMonthDayJs).set('date', value).toDate())
    .map((date: Date) => convertToDateModel(date, 'next'));

  // @ts-ignore
  state.calendarInput.dates = [
    ...prevMonthDates,
    ...currentMonthDates,
    ...nextMonthDates,
  ];

  return {
    state,
  };
};
