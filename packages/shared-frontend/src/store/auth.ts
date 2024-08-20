import { makeAutoObservable } from 'mobx';
import { LoginPayloadDto, TenantDto, UserDto } from '../model';
import { Galaxy } from './galaxy';
import { Effect } from 'effect';
import { login as loginApi } from '../apis';
import { AxiosError } from 'axios';

export enum AuthStatus {
  LoggedOut = 'LoggedOut',
  LoggingIn = 'LoggingIn',
  LogInFail = '로그인 실패',
  LoggedIn = 'LoggedIn',
  Authenticating = 'Authenticating',
  Authenticated = 'Authenticated',
  TokenRefreshing = 'TokenRefreshing',
}

export class Auth {
  galaxy: Galaxy;
  accessToken: string | undefined = undefined;
  currentSpaceId: string = localStorage.getItem('currentSpaceId') || '';
  currentTenant: TenantDto | undefined = undefined;
  user: UserDto | undefined = undefined;
  status: AuthStatus = AuthStatus.LoggedOut;

  constructor(galaxy: Galaxy) {
    makeAutoObservable(this, undefined, { autoBind: true });
    this.galaxy = galaxy;
  }

  login(loginPayloadDto: LoginPayloadDto) {
    this.status = AuthStatus.LoggingIn;
    return Effect.tryPromise({
      try: () => loginApi(loginPayloadDto),
      catch: err => {
        if (err instanceof AxiosError) {
          console.log(err.response.data);
        }
        this.status = AuthStatus.LogInFail;
        return new Error(`something went wrong ${err}`);
      },
    });
  }

  afterLogin() {}
}
