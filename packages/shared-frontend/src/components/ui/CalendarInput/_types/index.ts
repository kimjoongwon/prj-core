import { MobxProps } from '../../types';

export interface CalendarInputProps<T>
  extends Partial<CalendarInputPropsView<T>> {}

export enum Months {
  January = 0,
  February = 1,
  March = 2,
  April = 3,
  May = 4,
  June = 5,
  July = 6,
  August = 7,
  September = 8,
  October = 9,
  November = 10,
  December = 11,
}

export interface CalendarInputPropsView<T> extends MobxProps<T> {
  readOnly?: boolean;
  onClickDay?: (day: number) => void;
  currentMonthRange: number[];
  prevMonthRange: number[];
  nextMonthRange: number[];
  onClickPrevMonth: () => void;
  onClickNextMonth: () => void;
  year: number;
  month: number;
  date: number;
  selectedDates: Date[];
}
