import { makeAutoObservable } from 'mobx';
import { UserDto } from '../model/userDto';

export class AuthStore {
  constructor() {
    makeAutoObservable(this);
  }
  user: UserDto | undefined;
  accessToken: string | null = null;
}

export const authStore = new AuthStore();
