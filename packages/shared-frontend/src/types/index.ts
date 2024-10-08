import { Paths } from '../constants/Paths';

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
  pathname: Paths;
  params?: object;
  icon?: React.ReactNode;
}

export interface TableState<T> {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
  selectedRowIds: string[];
}
