import { makeAutoObservable } from 'mobx';
import { Route, RouteBuilder } from '@shared/types';
import { range } from 'lodash-es';

export class Navigation {
  routes: Route[] = [];
  MAIN_SERVICE_INDEX = 5;
  SERVICE_ITEM_INDEX = 6;

  constructor(routes: RouteBuilder[]) {
    this.routes = routes.map(route => {
      return {
        ...route,
        active: false,
      };
    });
    makeAutoObservable(this, {}, { autoBind: true });
  }

  findRoutesByIndex(index: number): Route[] {
    return this.findRoutesByIndexRecursive(this.routes, index);
  }

  get mainServiceRoutes() {
    return this.findRoutesByIndex(this.MAIN_SERVICE_INDEX) || [];
  }

  setActiveRoute(targetRoute: Route) {
    const segments = targetRoute.pathname.split('/');

    let parentPaths: string[] = [];

    range(0, segments.length).forEach(index => {
      const parentPath = '/' + segments.slice(1, index + 1).join('/');
      parentPaths.push(parentPath);
    });

    this.routes.forEach(route => {
      route.active = false;
    });

    this.routes.forEach(route => {
      if (parentPaths.includes(route.pathname)) {
        route.active = true;
      }
    });
  }

  get serviceItemRoutes() {
    return this.findRoutesByIndex(this.SERVICE_ITEM_INDEX) || [];
  }

  get currentActiveRoutePathnames() {
    return this.currentActiveRoutes.map(route => route.pathname);
  }

  get currentActiveRoutes() {
    let activeNavItems: Route[] = [];
    const findActiveNavItem = (route: Route) => {
      if (route.active) {
        activeNavItems.push(route);
      }

      if (route.children) {
        route.children.forEach(findActiveNavItem);
      }
    };

    this.routes.forEach(findActiveNavItem);

    return activeNavItems;
  }

  get currentRoute() {
    return this.currentActiveRoutes.pop();
  }

  private findRoutesByIndexRecursive(routes: Route[], index: number): Route[] {
    let result: Route[] = [];
    for (const route of routes) {
      const routeIndex = route.pathname.split('/').length;
      if (routeIndex === index) {
        result.push(route);
      }
      if (route.children) {
        result = result.concat(
          this.findRoutesByIndexRecursive(route.children, index),
        );
      }
    }
    return result;
  }
}
