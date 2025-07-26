import { makeAutoObservable } from "mobx";
import { NavigationStore } from "./navigationStore";
import { type RouteBuilder } from "@shared/types";

export class PlateStore {
  name: string = "PROTOTYPE";
  isInitialized = false;

  readonly navigation: NavigationStore;

  constructor(routeBuilders: RouteBuilder[] = []) {
    // 모든 스토어들을 PlateStore에서 생성
    this.navigation = new NavigationStore(this, routeBuilders);

    makeAutoObservable(this);
  }
}
