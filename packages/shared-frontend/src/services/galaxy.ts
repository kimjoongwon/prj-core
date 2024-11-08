import { Auth } from './auth';
import { Modal } from './modal';
import { makeAutoObservable } from 'mobx';

export class Galaxy {
  isInitialized = false;
  auth: Auth;
  modal: Modal;

  constructor() {
    this.auth = new Auth(this);
    this.modal = new Modal(this);
    this.isInitialized = true;
    makeAutoObservable(this);
  }
}
