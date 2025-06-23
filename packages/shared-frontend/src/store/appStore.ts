import { makeAutoObservable } from 'mobx';
import { NavigationService } from './navigationStore';

export class PlateService {
  name: string = 'PROTOTYPE';
  isInitialized = false;

  constructor(readonly navigation: NavigationService) {
    makeAutoObservable(this);
  }
}
