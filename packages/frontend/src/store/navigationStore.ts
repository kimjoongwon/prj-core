import { RouteDto } from "@cocrepo/api-client";
import { logger } from "@cocrepo/utils";
import { makeAutoObservable } from "mobx";
import { NavigatorStore } from "./navigatorStore";
import { PlateStore } from "./plateStore";
import { RouteStore } from "./routeStore";

const _logger = logger.create("[NavigationStore]");

export class NavigationStore {
  readonly plateStore: PlateStore;
  readonly navigator: NavigatorStore;
  routes: RouteStore[] = [];
  private _currentRoute: RouteDto | undefined = undefined;

  get currentRoute(): RouteDto | undefined {
    return this._currentRoute;
  }

  set currentRoute(route: RouteDto | undefined) {
    const routeChanged = this._currentRoute !== route;
    this._currentRoute = route;
    if (routeChanged) {
      this.updateActiveRoutes();
    }
  }

  constructor(
    plateStore: PlateStore,
    navigator: NavigatorStore,
    routeDtos: RouteDto[] = []
  ) {
    this.plateStore = plateStore;
    this.navigator = navigator;
    this.routes = routeDtos.map((routeDto) => new RouteStore(routeDto));
    this.initializeCurrentPath();
    makeAutoObservable(this);
  }

  /**
   * 초기 경로 설정 - localStorage에서 복원하거나 현재 위치 사용
   */
  private initializeCurrentPath(): void {
    const initialPath = window.location?.pathname || "";
    const routeDtos = this.routes.map((route) => this.routeStoreToDto(route));
    const route = this.navigator.getRouteByFullPath(initialPath, routeDtos);

    if (route) {
      this.currentRoute = route;
    }
  }

  private routeStoreToDto(routeStore: RouteStore): RouteDto {
    return {
      name: routeStore.name,
      fullPath: routeStore.fullPath,
      relativePath: routeStore.relativePath,
      icon: routeStore.icon,
      children:
        routeStore.children.length > 0
          ? routeStore.children.map((child) => this.routeStoreToDto(child))
          : null,
    };
  }

  private updateActiveRoutes(): void {
    this.resetAllActiveStates();

    if (this._currentRoute) {
      this.setActiveStatesForPath(this._currentRoute.fullPath);
    }
  }

  private resetAllActiveStates(): void {
    const resetRoute = (route: RouteStore): void => {
      route.active = false;
      route.children.forEach(resetRoute);
    };

    this.routes.forEach(resetRoute);
  }

  private setActiveStatesForPath(targetPath: string): void {
    const setActive = (route: RouteStore): boolean => {
      let isActive = false;

      // 정확한 매치 확인
      if (route.fullPath === targetPath) {
        route.active = true;
        return true;
      }

      // 하위 경로 매치 확인 (자식 경로가 현재 경로인 경우)
      if (targetPath.startsWith(`${route.fullPath}/`)) {
        route.active = true;
        isActive = true;
      }

      // 자식 경로들을 재귀적으로 확인
      if (route.children.length > 0) {
        const hasActiveChild = route.children.some(setActive);
        if (hasActiveChild) {
          route.active = true;
          isActive = true;
        }
      }

      return isActive;
    };

    this.routes.forEach(setActive);
  }
}
