'use client';

import React from 'react';
import { observer } from 'mobx-react-lite';
import { CalendarInputView } from './CalendarInput';
import { range } from 'lodash-es';
import { useProps } from './_hooks/useProps';
import dayjs from 'dayjs';
import { CalendarInputProps } from './_types';
import { DAY_OF_WEEK, WEEK_OF_MONTH } from './_constants';

export const CalendarInput = observer(
  <T extends object>(props: CalendarInputProps<T>) => {
    const {
      onClickNextMonth,
      onClickPrevMonth,
      state,
      currentMonth,
      prevMonthRange,
      nextMonthRange,
      onClickDay,
      month,
      selectedDates,
      year,
      date,
    } = useProps(props);

    return (
      <CalendarInputView
        {...props}
        onClickDay={onClickDay}
        currentMonthRange={currentMonth}
        prevMonthRange={prevMonthRange}
        nextMonthRange={nextMonthRange}
        onClickPrevMonth={onClickPrevMonth}
        onClickNextMonth={onClickNextMonth}
        date={date}
        month={month}
        year={year}
        selectedDates={selectedDates}
      />
    );
  },
);
