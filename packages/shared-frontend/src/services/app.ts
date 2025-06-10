import { makeAutoObservable } from 'mobx';
import { DepotService } from './depot';
import { ModalService } from './modal';
import { NavigationService } from './navigation';

export class PlateService {
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
