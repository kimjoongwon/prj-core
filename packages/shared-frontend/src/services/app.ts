import { NavigationService } from './navigation';
import { ButtonService } from './button';
import { ColumnService } from './column';
import { makeAutoObservable } from 'mobx';
import { DepotService } from './depot';

export class App {
  name: string = '앱네임';
  isInitialized = false;

  constructor(
    readonly navigationService: NavigationService,
    readonly buttonService: ButtonService,
    readonly columnService: ColumnService,
    readonly depotService: DepotService,
  ) {
    this.isInitialized = true;
    makeAutoObservable(this);
  }
}
