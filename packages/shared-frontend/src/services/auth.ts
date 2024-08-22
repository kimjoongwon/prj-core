import { makeAutoObservable } from 'mobx';
import { LoginPayloadDto, TokenDto, UserDto } from '../model';
import { Galaxy } from './galaxy';
import { Effect, pipe } from 'effect';
import { AxiosError } from 'axios';
import { getToken } from '../apis';
import { AuthStatus } from '../types';
import { GalaxyError, InvalidPasswordError } from '../errors';

export class Auth {
  galaxy: Galaxy;
  accessToken: string | undefined = undefined;
  user: UserDto | undefined = undefined;
  status: AuthStatus = AuthStatus.LoggedOut;

  constructor(galaxy: Galaxy) {
    makeAutoObservable(this, undefined, { autoBind: true });
    this.galaxy = galaxy;
  }

  setStatus(status: AuthStatus) {
    this.status = status;
  }

  getToken(loginPayloadDto: LoginPayloadDto) {
    return Effect.tryPromise({
      try: () => getToken(loginPayloadDto),
      catch: (err: AxiosError) => {
        if (err.message === '패스워드가 일치하지 않습니다.') {
          return new InvalidPasswordError();
        }
        return new GalaxyError();
      },
    });
  }

  beforeLogin() {
    this.status = AuthStatus.LoggingIn;
    this.galaxy.router.push({
      url: '/admin/main',
    });
  }

  login(loginPayloadDto: LoginPayloadDto) {
    return Effect.runPromise(
      pipe(
        this.beforeLogin(),
        () => this.getToken(loginPayloadDto),
        Effect.match({
          onSuccess: this.afterLogin,
          onFailure: error => {
            if (error._tag === 'InvalidPasswordError') {
              this.status = AuthStatus.InvalidPassword;
            }
            if (error._tag === 'GalaxyError') {
              this.status = AuthStatus.LoggedInFailed;
            }
          },
        }),
      ),
    );
  }

  afterLogin({ user, accessToken }: TokenDto) {
    this.accessToken = accessToken;
    this.user = user;
    this.status = AuthStatus.LoggedIn;
  }

  logout() {
    this.accessToken = undefined;
    this.user = undefined;
    this.status = AuthStatus.LoggedOut;
  }
}
