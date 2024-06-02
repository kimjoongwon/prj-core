import { makeAutoObservable, reaction } from 'mobx';
import { LoginPayloadDto, TenantDto, TokenDto, UserDto } from '../model';
import { AxiosError, HttpStatusCode } from 'axios';
import { login, refreshToken } from '../apis';
import { MyUniv } from './myUniv';
import { SpaceSelectModalContent } from '../components/modal/contents/SpaceSelect';
import Button from '../components/ui/Button';

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
  currentSpaceId: string = localStorage.getItem('currentSpaceId') || '';
  currentTenant: TenantDto | undefined = undefined;
  user: UserDto | undefined = undefined;
  private _status: AuthStatus = AuthStatus.LoggedOut;

  constructor(app: MyUniv) {
    makeAutoObservable(this, {}, { autoBind: true });
    this.app = app;
  }

  set status(status: AuthStatus) {
    this._status = status;
  }

  get status() {
    return this._status;
  }

  reactionOnSpaceIdChange() {
    reaction(
      () => this.currentSpaceId,
      newSpaceId => {
        const currentSpaceId = localStorage.getItem('currentSpaceId');

        if (!currentSpaceId) {
          const tenant = this.user?.tenants.find(
            tenant => tenant.spaceId === newSpaceId,
          );
          this.currentTenant = tenant;
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
    this.status = AuthStatus.Authenticated;
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
    this.app.modal.open = true;
    this.app.modal.body = <SpaceSelectModalContent />;
    this.app.modal.footer = (
      <Button
        onClick={() => {
          this.app.modal.close();
          this.app.auth.status = AuthStatus.Authenticated;
          this.app.router.push({ url: '/admin/main' });
        }}
      >
        완료
      </Button>
    );
  }

  onLoginError(error: unknown) {
    this._status = AuthStatus.LoggedOut;
    if (error instanceof Error) {
      alert(error.message);
    }
  }

  logout() {
    this._status = AuthStatus.LoggedOut;
    this.currentSpaceId = '';
    this.currentTenant = undefined;
    this.user = undefined;
    this.accessToken = undefined;
  }

  refreshToken() {}
}
