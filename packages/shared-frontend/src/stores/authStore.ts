import { makeAutoObservable } from 'mobx';
import { UserDto } from '../model/userDto';

export class AuthStore {
  constructor() {
    makeAutoObservable(this);
  }
  user: UserDto | undefined = undefined;
  accessToken: string | undefined = undefined;
}

export const authStore = new AuthStore();
