import { NavigationService } from './navigation';
import { makeAutoObservable } from 'mobx';
import { DepotService } from './depot';
import { ModalService } from './modal';

export class Illit {
  name: string = 'PROTOTYPE';
  isInitialized = false;

  constructor(
    readonly navigation: NavigationService,
    readonly depot: DepotService,
    readonly modal: ModalService,
  ) {
    makeAutoObservable(this);
  }
}
