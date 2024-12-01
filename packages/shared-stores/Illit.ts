import { makeAutoObservable } from 'mobx';
import { Navigation } from './navigation';
import { AppBuilder } from '@shared/types';

export class Illit {
  navigation: Navigation;
  appBuilder: AppBuilder;
  isInitialized = false;
  constructor(navigation: Navigation, appBuilder: AppBuilder) {
    this.navigation = navigation;
    this.appBuilder = appBuilder;

    makeAutoObservable(this);
  }
}
