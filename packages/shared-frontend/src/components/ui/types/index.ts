import { ButtonProps, LinkProps } from '@nextui-org/react';
import { HeaderContext } from '@tanstack/react-table';

export type Join<K, P> = K extends string | number
  ? P extends string | number
    ? `${K}${'' extends P ? '' : '.'}${P}`
    : never
  : never;

export type Prev = [
  never,
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  ...0[],
];

export type Paths<T, D extends number = 10> = [D] extends [never]
  ? never
  : T extends object
    ? {
        [K in keyof T]-?: K extends string | number
          ? `${K}` | Join<K, Paths<T[K], Prev[D]>>
          : never;
      }[keyof T]
    : '';

export type Leaves<T, D extends number = 10> = [D] extends [never]
  ? never
  : T extends object
    ? { [K in keyof T]-?: Join<K, Leaves<T[K], Prev[D]>> }[keyof T]
    : '';

export interface FormUnitProps<T> {
  state: T;
  path: Leaves<T, 4>;
}

export interface MobxProps<T> {
  path: Paths<T, 4>;
  state?: T;
}
export interface HeaderCellProps<T, M> {
  headerContext: HeaderContext<T, string>;
  mobxProps: MobxProps<M>;
}

export interface ContainerProps {
  children: React.ReactNode;
}

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

export interface TableState<T extends object> {
  search: {
    [key in keyof T]?: string;
  };
  query: {
    [key in keyof T]?: string;
  };
}
export interface GroupButton extends ButtonProps {
  href?: LinkProps['href'];
}

export interface ContainerProps {
  children: React.ReactNode;
}
