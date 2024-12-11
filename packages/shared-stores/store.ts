import { makeAutoObservable } from 'mobx';
import { Navigation } from './navigation';
import { AppBuilder } from '@shared/frontend';

export class Store {
  name: string = 'Illit';
  navigation: Navigation;
  appBuilder: AppBuilder;
  isInitialized = false;

  constructor(navigation: Navigation, appBuilder: AppBuilder) {
    this.navigation = navigation;
    this.appBuilder = appBuilder;
    makeAutoObservable(this);
  }
}
