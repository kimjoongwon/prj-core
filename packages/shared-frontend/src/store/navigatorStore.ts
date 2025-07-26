import { type PlateStore } from "./plateStore";

export interface INavigationStore {
  activateRoute(pathname: string): void;
}

export class NavigatorStore {
  readonly plateStore: PlateStore;

  constructor(plateStore: PlateStore) {
    this.plateStore = plateStore;
  }
}
