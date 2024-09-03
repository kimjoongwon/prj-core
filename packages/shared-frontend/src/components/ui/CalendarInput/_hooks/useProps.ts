import { useHandlers } from './useHandlers';
import { CalendarInputProps } from '../_types';
import { useState } from './useState';
import { useContext } from './useContext';
import dayjs from 'dayjs';
import { range } from 'lodash-es';

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

  const prevMontRange = range(
    prevMonth.daysInMonth() - startDayOfMonthDay,
    prevMonth.daysInMonth(),
  );

  const currentMonth = range(1, today.daysInMonth() + 1);

  const nextMonthRange = range(
    1,
    DAY_OF_WEEK * WEEK_OF_MONTH -
      (prevMontRange.length + currentMonth.length) +
      1,
  );

  return {
    state,
    onClickNextMonth,
    onClickPrevMonth,
    prevMontRange,
    currentMonth,
    nextMonthRange,
  };
};
