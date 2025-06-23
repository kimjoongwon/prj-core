import { makeAutoObservable } from 'mobx';

export class AuthStore {
  private plateStore: any; // PlateStore 타입은 순환 참조 방지를 위해 any 사용

  constructor(plateStore: any) {
    this.plateStore = plateStore;
    makeAutoObservable(this);
  }
}
