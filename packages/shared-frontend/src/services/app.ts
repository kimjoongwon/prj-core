import { RouteBuilder } from '@shared/types';
import { Navigation } from './navigation';
import { ButtonService } from './button';
import { ColumnService } from './column';
import { makeAutoObservable } from 'mobx';
import { DepotService } from './depot';

export class App {
  name: string = '앱네임';
  navigationService: Navigation;
  buttonService: ButtonService;
  columnService: ColumnService;
  depotService: DepotService;
  isInitialized = false;

  constructor(routes: RouteBuilder[]) {
    this.navigationService = new Navigation(routes);
    this.buttonService = new ButtonService();
    this.columnService = new ColumnService();
    this.depotService = new DepotService();
    this.isInitialized = true;
    makeAutoObservable(this);
  }
}
