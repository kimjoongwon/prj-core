import { useHandlers } from './useHandlers';
import { useContext } from './useContext';
import { CalendarInputProps } from '../_types';
import { useState } from './useState';
import dayjs from 'dayjs';
import { range } from 'lodash-es';
import { DAY_OF_WEEK, WEEK_OF_MONTH } from '../_constants';

export const useProps = <T extends object>(props: CalendarInputProps<T>) => {
  const context = useContext<T>(props);
  const state = useState({
    context,
  });
  const { onClickNextMonth, onClickPrevMonth, onClickDay } = useHandlers({
    state,
  });

  const today = dayjs();
  // 요일(월, 화, 수 등등)
  const startDayOfMonthDay = dayjs().startOf('month').day();
  const prevMonth = dayjs().subtract(1, 'month');

  const prevMonthRange = range(
    prevMonth.daysInMonth() - startDayOfMonthDay,
    prevMonth.daysInMonth(),
  );

  const currentMonth = range(1, today.daysInMonth() + 1);

  const nextMonthRange = range(
    1,
    DAY_OF_WEEK * WEEK_OF_MONTH -
      (prevMonthRange.length + currentMonth.length) +
      1,
  );

  return {
    state,
    year: state.calendarDate.getFullYear(),
    month: state.calendarDate.getMonth() + 1,
    date: state.calendarDate.getDate(),
    selectedDates: state.value,
    onClickNextMonth,
    onClickPrevMonth,
    onClickDay,
    prevMonthRange,
    currentMonth,
    nextMonthRange,
  };
};
