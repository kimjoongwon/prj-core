'use client';

import React from 'react';
import { observer } from 'mobx-react-lite';
import { CalendarInputView } from './CalendarInput';
import { range } from 'lodash-es';
import { useProps } from './_hooks/useProps';
import dayjs from 'dayjs';
import { CalendarInputProps } from './_types';

export const CalendarInput = observer(
  <T extends object>(props: CalendarInputProps<T>) => {
    const { onClickNextMonth, onClickPrevMonth, state } = useProps(props);

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

    return (
      <CalendarInputView
        {...props}
        onClickDay={onClickDay}
        currentMonthRange={currentMonth}
        prevMonthRange={prevMontRange}
        nextMonthRange={nextMonthRange}
        onClickPrevMonth={onClickPrevMonth}
        onClickNextMonth={onClickNextMonth}
        date={today.date()}
        month={today.month() + 1}
        year={today.year()}
        selectedDates={state.value}
      />
    );
  },
);
