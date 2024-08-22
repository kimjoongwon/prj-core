import { AxiosError } from 'axios';

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
