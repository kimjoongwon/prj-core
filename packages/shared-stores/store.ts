import { Navigation } from './navigation';
import { makeAutoObservable } from 'mobx';

export class Store {
  name: string = 'Illit';
  navigation: Navigation;
  isInitialized = false;

  constructor(navigation: Navigation) {
    this.navigation = navigation;
    makeAutoObservable(this);
  }
}
