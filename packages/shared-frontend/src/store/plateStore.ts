import { makeAutoObservable } from 'mobx';
import { NavigationStore } from './navigationStore';
import { NavigatorStore } from './navigatorStore';
import { AuthStore } from './authStore';
import { type RouteBuilder } from '@shared/types';

export class PlateStore {
  name: string = 'PROTOTYPE';
  isInitialized = false;
  
  readonly navigation: NavigationStore;
  readonly navigator: NavigatorStore;
  readonly auth: AuthStore;

  constructor(routeBuilders: RouteBuilder[] = []) {
    // 모든 스토어들을 PlateStore에서 생성
    this.navigator = new NavigatorStore(this);
    this.auth = new AuthStore(this);
    this.navigation = new NavigationStore(this, routeBuilders);
    
    makeAutoObservable(this);
  }
}
