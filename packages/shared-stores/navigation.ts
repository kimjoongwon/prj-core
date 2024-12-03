import { makeAutoObservable } from 'mobx';
import { Route, RouteBuilder } from '@shared/types';
import { range } from 'lodash-es';

export class Navigation {
  routeBuilders: RouteBuilder[] = [];
  MAIN_SERVICE_INDEX = 5;
  SERVICE_ITEM_INDEX = 6;

  constructor(routeBuilders: RouteBuilder[]) {
    this.routeBuilders = routeBuilders;
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get routes() {
    // let routes: Route[] = [];
    // this.remoteRoutes.forEach(route => {
    //   const getRoute = (route: RouteBuilder) => {
    //     if (route.children) {
    //       route.children.map(getRoute);
    //     }
    //     routes.push({
    //       pathname: route.pathname,
    //       name: route.name,
    //       active: false,
    //     });
    //   };
    //   if (route.children) {
    //     route.children.map(getRoute);
    //   }
    //   routes.push({
    //     pathname: route.pathname,
    //     name: route.pathname,
    //     active: false,
    //   });
    // });
    return [];
  }

  findRoutesByIndex(index: number): Route[] {
    return this.findRoutesByIndexRecursive(this.routes, index);
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

  get mainServiceRoutes() {
    const findMainRoute = (route: Route) => {
      if (route.pathname === '/admin/main') {
        return route.children;
      }
      if (route.children) {
        route.children?.forEach(findMainRoute);
      }
    };

    for (let route of this.routes) {
      console.log(route.pathname);
      if (route.pathname === '/admin/main') {
        return route.children;
      }
      if (route.children) {
        route.children?.forEach(findMainRoute);
      }
    }
  }

  get serviceItemRoutes() {
    const activeMainServiceRoute = this.mainServiceRoutes?.find(
      route => route.active,
    );

    return activeMainServiceRoute?.children || [];
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
