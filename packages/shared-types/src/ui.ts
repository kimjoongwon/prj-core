import type { ButtonProps, LinkProps } from '@heroui/react';
import type { HeaderContext } from '@tanstack/react-table';
import type { Paths, Leaves, MobxProps } from './types';

// Form and component props interfaces  
export interface FormUnitProps<T> {
  state: T;
  path: Leaves<T, 4>;
}

export interface HeaderCellProps<T, M> {
  headerContext: HeaderContext<T, string>;
  mobxProps: MobxProps<M>;
}

export interface ContainerProps {
  children: React.ReactNode;
}

// Table and data grid related interfaces
export interface PaginationState {
  skip: number;
  take: number;
}

export interface QuerySorting {
  query: {
    sortingKey?: string;
    sortingValue?: 'asc' | 'desc';
    skip: number;
    take: number;
  };
}

export interface SearchFilterState<T extends object> {
  filter?: {
    [key in keyof T]?: string;
  };
}

// Button and UI component interfaces
export interface GroupButton extends ButtonProps {
  href?: LinkProps['href'];
}

// FileUploader related types
export interface UploadedMedia {
  id: string;
  url: string;
  type: 'image' | 'video';
}

export interface SortableMediaProps {
  media: Partial<any>; // TODO: Replace with proper FileDto type when available
  onRemove: (id: string) => void;
}

export interface MediaUploadProps {
  mode: 'single' | 'multiple';
  maxFiles?: number;
}

export interface VideoPlayerProps {
  src: string;
}

// CalendarInput related types
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
  state: any; // Replace with proper type when useProps is available
}

export type ISOString = string;

export interface DateModel {
  value: string;
  selected: boolean;
  selectDate: () => void;
  className?: string;
  isPressable?: boolean;
}

export interface CalendarState {
  calendarInput: {
    header: {
      date: Date;
      increaseMonth: () => void;
      decreaseMonth: () => void;
    };
    dates: DateModel[];
  };
}