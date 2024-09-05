import { MobxProps } from '../../types';
import { useProps } from '../_hooks/useProps';

export interface CalendarInputProps<T> extends MobxProps<T> {}

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

export interface CalendarInputPropsView {
  readOnly?: boolean;
  state: ReturnType<typeof useProps>['state'];
}

export interface DateModel {
  value: Date;
  selected: boolean;
  selectDate: () => void;
  className?: string;
  isPressable?: boolean;
}

export interface State {
  calendarInput: {
    header: {
      date: Date;
      increaseMonth: () => void;
      decreaseMonth: () => void;
    };
    dates: DateModel[];
  };
}
