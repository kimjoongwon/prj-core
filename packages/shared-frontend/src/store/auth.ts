import { action, makeAutoObservable } from 'mobx';
import { LoginPayloadDto, TenantDto, TokenDto, UserDto } from '../model';
import { Galaxy } from './galaxy';
import { Effect, pipe } from 'effect';
import { AxiosError } from 'axios';
import { getToken } from '../apis';

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

export class InvalidPasswordError {
  readonly _tag = 'InvalidPasswordError';
}

export class _AxiosError {
  readonly _tag = 'AxiosError';
}

export class Auth {
  galaxy: Galaxy;
  accessToken: string | undefined = undefined;
  user: UserDto | undefined = undefined;
  status: InvalidPasswordError['_tag'] | _AxiosError['_tag'];

  constructor(galaxy: Galaxy) {
    makeAutoObservable(
      this,
      {
        login: action,
      },
      { autoBind: true },
    );
    this.galaxy = galaxy;
  }

  test(loginPayloadDto: LoginPayloadDto) {
    return Effect.tryPromise({
      try: () => getToken(loginPayloadDto),
      catch: (err: AxiosError) => {
        if (err.message === 'INVALID_PASSWORD') {
          return new InvalidPasswordError();
        }
        // this.status = AuthStatus.LoggedInFailed;
        return new _AxiosError();
      },
    });
  }

  login(loginPayloadDto: LoginPayloadDto) {
    // this.status = AuthStatus.LoggingIn;
    pipe(
      this.test(loginPayloadDto),
      Effect.match({
        onSuccess: this.afterLogin,
        onFailure: error => (this.status = error._tag),
      }),
    );
  }

  afterLogin({ user, accessToken }: TokenDto) {
    this.accessToken = accessToken;
    this.user = user;
  }
}
