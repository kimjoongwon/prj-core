import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { Auth } from './auth';
import { Modal } from './modal';
import { Router } from './router';
import { makeAutoObservable } from 'mobx';

export class MyUniv {
  _isInitialized = false;
  readonly auth: Auth;
  readonly router: Router;
  readonly modal: Modal;
  constructor(nextRouter: AppRouterInstance) {
    makeAutoObservable(this);
    this.auth = new Auth(this);
    this.router = new Router(this, nextRouter);
    this.modal = new Modal(this);
    this._isInitialized = true;
  }

  get isInitialized() {
    return this._isInitialized;
  }
}
