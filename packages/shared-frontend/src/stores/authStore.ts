import { makeAutoObservable, reaction } from 'mobx';
import { UserDto } from '../model/userDto';
import { TenantDto, TokenDto } from '../model';

export class AuthStore {
  currentSpaceId: string | undefined = undefined;
  currentTenant: TenantDto | undefined = undefined;
  user: UserDto | undefined = undefined;
  accessToken: string | undefined = undefined;

  constructor() {
    makeAutoObservable(this);
    reaction(
      () => this.currentSpaceId,
      newSpaceId => {
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

  login(tokeDto: TokenDto) {
    this.accessToken = tokeDto.accessToken;
    this.user = tokeDto.user;
    this.currentSpaceId = this.user?.tenants[0].spaceId;
    this.currentTenant = this.user?.tenants[0];
  }

  logout() {
    this.currentSpaceId = undefined;
    this.currentTenant = undefined;
    this.user = undefined;
    this.accessToken = undefined;
  }
}

export const authStore = new AuthStore();
