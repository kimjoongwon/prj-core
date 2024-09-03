import dayjs from 'dayjs';
import { useState } from './useState';

export const useHandlers = ({
  state,
}: {
  state: ReturnType<typeof useState>;
}) => {
  const onClickNextMonth = () =>
    (state.calendarDate = dayjs(state.calendarDate).add(1, 'M').toDate());

  const onClickPrevMonth = () =>
    (state.calendarDate = dayjs(state.calendarDate).subtract(1, 'M').toDate());

  const onClickDay = (day: number) => {
    const selectedDate = dayjs(state.calendarDate).set('D', day).toDate();
    const isSameDay = state.value.some(value =>
      dayjs(value).isSame(selectedDate, 'date'),
    );

    if (!isSameDay) {
      state.value.push(selectedDate);
    } else {
      state.value.filter(date => !dayjs(date).isSame(selectedDate, 'date'));
    }
  };

  return {
    onClickDay,
    onClickNextMonth,
    onClickPrevMonth,
  };
};
