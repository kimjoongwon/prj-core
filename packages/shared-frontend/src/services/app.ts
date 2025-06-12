import { makeAutoObservable } from 'mobx';
import { ModalService } from './modal';
import { NavigationService } from './navigation';

export class PlateService {
  name: string = 'PROTOTYPE';
  isInitialized = false;

  constructor(
    readonly navigation: NavigationService,
    readonly modal: ModalService,
  ) {
    makeAutoObservable(this);
  }
}
