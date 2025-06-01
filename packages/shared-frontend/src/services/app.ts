import { makeAutoObservable } from 'mobx';
import { DepotService } from './depot';
import { ModalService } from './modal';
import { UnifiedNavigationService } from './UnifiedNavigationService';

export class Illit {
  name: string = 'PROTOTYPE';
  isInitialized = false;

  constructor(
    readonly navigation: UnifiedNavigationService,
    readonly depot: DepotService,
    readonly modal: ModalService,
  ) {
    makeAutoObservable(this);
  }
}
