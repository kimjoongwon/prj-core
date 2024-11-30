import { makeAutoObservable } from 'mobx';

export class Galaxy {
  isInitialized = false;

  constructor() {
    this.isInitialized = true;
    makeAutoObservable(this);
  }
}

// Store 전역 -> Menu or Page
// Store 가 붙지 않았다면 전역 서비스 Router, Auth,
//
