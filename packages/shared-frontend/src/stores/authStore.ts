import { makeAutoObservable, reaction } from 'mobx';
import { UserDto } from '../model/userDto';
import { TenantDto } from '../model';

export class AuthStore {
  constructor() {
    makeAutoObservable(this);
    reaction(
      () => this.currentSpaceId,
      newSpaceId => {
        console.log('this.user', this.user);
        const tenant = this.user?.tenants.find(
          tenant => tenant.spaceId === newSpaceId,
        );

        this.currentTenant = tenant;
      },
    );
  }

  currentSpaceId: string | undefined = undefined;
  currentTenant: TenantDto | undefined = undefined;
  user: UserDto | undefined = undefined;
  accessToken: string | undefined = undefined;
}

export const authStore = new AuthStore();
