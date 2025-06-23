import { makeAutoObservable } from 'mobx';
import { NavigationStore } from './navigationStore';

export class PlateStore {
  name: string = 'PROTOTYPE';
  isInitialized = false;

  constructor(readonly navigation: NavigationStore) {
    makeAutoObservable(this);
  }
}
