import { makeAutoObservable, reaction } from 'mobx';
import { LoginPayloadDto, TenantDto, TokenDto, UserDto } from '../model';
import { AxiosError, HttpStatusCode } from 'axios';
import { login, refreshToken } from '../apis';
import { MyUniv } from './myUniv';

export enum AuthStatus {
  LoggedOut = 'LoggedOut',
  LoggingIn = 'LoggingIn',
  LoggedIn = 'LoggedIn',
  Authenticating = 'Authenticating',
  Authenticated = 'Authenticated',
  TokenRefreshing = 'TokenRefreshing',
}

export class Auth {
  app: MyUniv;
  accessToken: string | undefined = undefined;
  currentSpaceId: string | undefined = undefined;
  currentTenant: TenantDto | undefined = undefined;
  user: UserDto | undefined = undefined;
  private _status: AuthStatus = AuthStatus.LoggedOut;

  constructor(app: MyUniv) {
    makeAutoObservable(this, {}, { autoBind: true });
    this.app = app;
    this.reactionOnChangeStatus();
  }

  set status(status: AuthStatus) {
    this._status = status;
  }

  get status() {
    return this._status;
  }

  reactionOnChangeStatus() {
    reaction(
      () => this._status,
      status => {
        console.log('status', status);
        switch (status) {
          case AuthStatus.LoggedOut:
            this.logout();
            this.app.router.push({ url: '/admin/auth/login' });
            break;
          case AuthStatus.LoggedIn:
            this.app.modal.openSpaceSelectModal();
            break;
          case AuthStatus.TokenRefreshing:
            this.app.modal.openSpaceSelectModal();
            break;
          case AuthStatus.Authenticated:
            this.app.router.push({ url: '/admin/main' });
            break;
        }
      },
    );
  }

  reactionOnSpaceIdChange() {
    reaction(
      () => this.currentSpaceId,
      newSpaceId => {
        console.log('newSpaceId', newSpaceId);
        try {
          const tenant = this.user?.tenants.find(
            tenant => tenant.spaceId === newSpaceId,
          );

          this.currentTenant = tenant;
        } catch (error) {
          alert(error);
        }
      },
    );
  }

  refreshing() {
    refreshToken().then(this.onRefreshTokenSuccess, this.onErrorRefreshToken);
  }

  onRefreshTokenSuccess(tokenDto: TokenDto) {
    this.status = AuthStatus.TokenRefreshing;
    this.user = tokenDto.user;
    this.accessToken = tokenDto.accessToken;
  }

  onErrorRefreshToken(error: unknown) {
    if (error instanceof Error) {
      alert(error.message);
    }
    if (error instanceof AxiosError) {
      if (error.response?.status === HttpStatusCode.Ok) {
      }
    }
  }

  setToken(tokeDto: TokenDto) {
    this.accessToken = tokeDto.accessToken;
    this.user = tokeDto.user;
    this.currentSpaceId = this.user?.tenants[0].spaceId;
    this.currentTenant = this.user?.tenants[0];
  }

  login(loginPayloadDto: LoginPayloadDto) {
    this._status = AuthStatus.LoggingIn;
    login(loginPayloadDto).then(this.onLoginSuccess, this.onLoginError);
  }

  onLoginSuccess(tokenDto: TokenDto) {
    this.accessToken = tokenDto?.accessToken || '';
    this.user = tokenDto?.user;
    this._status = AuthStatus.LoggedIn;
  }

  onLoginError(error: unknown) {
    this._status = AuthStatus.LoggedOut;
    if (error instanceof Error) {
      alert(error.message);
    }
  }

  logout() {
    this._status = AuthStatus.LoggedOut;
    this.currentSpaceId = undefined;
    this.currentTenant = undefined;
    this.user = undefined;
    this.accessToken = undefined;
  }

  refreshToken() {}
}
