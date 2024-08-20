import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { Auth } from './auth';
import { Modal } from './modal';
import { Router } from './router';
import { makeAutoObservable } from 'mobx';

export class Galaxy {
  isInitialized = false;
  auth: Auth;
  router: Router;
  modal: Modal;

  constructor(nextRouter: AppRouterInstance) {
    this.auth = new Auth(this);
    this.router = new Router(this, nextRouter);
    this.modal = new Modal(this);
    this.isInitialized = true;
    makeAutoObservable(this);
  }
}
