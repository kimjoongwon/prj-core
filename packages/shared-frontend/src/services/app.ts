import { makeAutoObservable } from 'mobx';
import { DepotService } from './depot';
import { ModalService } from './modal';
import { UnifiedNavigationService } from './navigation';

export class PlateService {
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
