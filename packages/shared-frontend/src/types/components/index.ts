import {
  type ButtonProps,
  type AutocompleteProps,
  type UserProps,
  type ListboxProps as NextUIListboxProps,
  ListboxItemProps,
} from '@nextui-org/react';
import { type BottomNavigationProps } from '@mui/material';
import { MobxProps } from '../../utils';
import { GroupButton } from '../../components/ui/types';

export interface ListboxViewProps extends ListBoxProps<any> {
  value: any;
}

export interface ListBoxProps<T>
  extends Omit<NextUIListboxProps, 'state' | 'children'>,
    MobxProps<T> {
  items: ListboxItemProps[];
}

export interface MainNavBarViewProps {
  onClickNavBarItem: (value: string) => void;
  navItems: ButtonProps[];
  value: any;
}

export interface MainNavBarProps<T> extends MobxProps<T> {
  navItems: ButtonProps[];
  value: any;
}

export interface AppBarViewProps extends AppBarProps {}
export interface AppBarProps {
  children?: React.ReactNode;
  content?: React.ReactNode;
}

export interface BaseAutoCompleteProps<T>
  extends Omit<AutocompleteProps, 'children'>,
    MobxProps<T> {
  options: {
    text: string;
    value: any;
    description?: string;
  }[];
}

export interface AvatarProps extends UserProps {}

export interface BottomTabPath {
  name: string;
  pathname: string;
  params?: object;
  isVisible?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
  children?: Route[];
}
export interface BottomTabProps extends BottomNavigationProps {
  children?: React.ReactNode;
}
export interface BottomTabViewProps extends BottomTabProps {}

export interface ButtonViewProps extends ButtonProps {}

export interface ButtonGroupProps {
  leftButtons?: GroupButton[];
  rightButtons?: GroupButton[];
}

export enum AuthStatus {
  LoggedOut = 'LoggedOut',
  LoggingIn = 'LoggingIn',
  LoggedInFailed = 'LoggedInFailed',
  InvalidPassword = 'InvalidPassword',
  LoggedIn = 'LoggedIn',
  Authenticating = 'Authenticating',
  Authenticated = 'Authenticated',
  TokenRefreshing = 'TokenRefreshing',
}

export enum Month {
  January = 'January',
  February = 'February',
  March = 'March',
  April = 'April',
  May = 'May',
  June = 'June',
  July = 'July',
  August = 'August',
  September = 'September',
  October = 'October',
  November = 'November',
  December = 'December',
}

export interface Route {
  name: string;
  pathname: string;
  params?: object;
  icon?: React.ReactNode;
}

export interface TableState {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
  selectedRowIds: string[];
}

export interface CustomTable {
  standalone?: boolean;
}

export * from './TilesProps';
export * from './ResponsiveProps';
