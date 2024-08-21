import { makeAutoObservable } from 'mobx';
import { LoginPayloadDto, TenantDto, UserDto } from '../model';
import { Galaxy } from './galaxy';
import { Effect } from 'effect';
import { AxiosError } from 'axios';
import { getToken } from '../apis';
import { match } from 'effect/Option';

export enum AuthStatus {
  LoggedOut = 'LoggedOut',
  LoggingIn = 'LoggingIn',
  LogInFail = '로그인 실패',
  InvalidPassword = 'InvalidPassword',
  LoggedIn = 'LoggedIn',
  Authenticating = 'Authenticating',
  Authenticated = 'Authenticated',
  TokenRefreshing = 'TokenRefreshing',
}

export class InvalidPasswordError {
  readonly _tag = 'InvalidPasswordError';
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

  async login(loginPayloadDto: LoginPayloadDto) {
    this.status = AuthStatus.LoggingIn;
    const program = Effect.tryPromise({
      try: () => getToken(loginPayloadDto),
      catch: (err: AxiosError) => {
        if (err.message === 'INVALID_PASSWORD') {
          Effect.fail(new InvalidPasswordError());
        }
      },
    });

    const result = Effect.runPromise(program);
    return program;
  }
}
