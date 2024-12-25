import { makeAutoObservable } from 'mobx';
import { type RouteBuilder, type Route } from '@shared/types';
import { PathUtil } from '@shared/utils';

type NavigateFunction = (pathnameWithSearchParams: string) => void;

export class Navigation {
  routeBuilders: RouteBuilder[] = [];
  routes: Route[] = [];
  navigateFunction?: NavigateFunction;

  constructor(routeBuilders: RouteBuilder[]) {
    this.routeBuilders = routeBuilders;
    this.getRoutes();
    this.activateRoute();
  }

  setNavigateFunction(navigateFunction: NavigateFunction) {
    this.navigateFunction = navigateFunction;
  }

  push(
    pathname: string,
    pathParams: object,
    searchParams?: Record<string, string>,
  ) {
    let urlSearchParams;
    if (searchParams) {
      urlSearchParams = new URLSearchParams(searchParams).toString();
    }
    const pathnameWithSearchParams = PathUtil.getUrlWithParamsAndQueryString(
      pathname,
      pathParams,
      urlSearchParams,
    );

    this.navigateFunction?.(pathnameWithSearchParams);
  }

  private findRouteByPath(pathname: string) {
    let findedRoute: Route;
    const findRoute = (route: Route) => {
      if (route.pathname === pathname) {
        findedRoute = route;
      }

      if (route.children) {
        return route.children.forEach(findRoute);
      }
    };

    this.routes.forEach(route => {
      if (route.pathname === pathname) {
        findedRoute = route;
      }

      if (route.children) {
        route.children.forEach(findRoute);
      }
    });

    return findedRoute!;
  }

  get servicesRoute() {
    const servicesRoute = this.findRouteByPath('services');
    return servicesRoute;
  }

  get serviceRoute() {
    const serviceRoute = this.servicesRoute.children?.find(
      serviceRoute => serviceRoute.active,
    );

    return serviceRoute;
  }

  activateRoute() {
    const segments = window.location.pathname;

    const changeRouteActiveState = (route: Route) => {
      if (segments.includes(route.pathname)) {
        route.active = true;
      } else {
        route.active = false;
      }

      if (route.children) {
        route.children.forEach(changeRouteActiveState);
      }
    };

    this.routes.forEach(route => {
      const url = PathUtil.getUrlWithParamsAndQueryString(
        route.pathname,
        route.params,
      );
      if (segments.includes(url)) {
        route.active = true;
      } else {
        route.active = false;
      }

      route.children?.forEach(changeRouteActiveState);
    });
  }

  getRoutes() {
    const convertRouteBuilderToRoute = (routeBuilder: RouteBuilder) => {
      const route: Route = {
        name: routeBuilder?.name,
        pathname: routeBuilder?.pathname,
        params: routeBuilder?.params,
        active: false,
        children: [],
      };

      if (routeBuilder.children) {
        route.children = routeBuilder.children.map(convertRouteBuilderToRoute);
      }

      return route;
    };

    const routes = this.routeBuilders.map(routeBuilder => {
      const route: Route = {
        name: routeBuilder.name,
        pathname: routeBuilder.pathname,
        active: false,
        params: routeBuilder.params,
        children: [],
      };

      if (routeBuilder.children) {
        route.children = routeBuilder.children.map(convertRouteBuilderToRoute);
      }

      return route;
    });

    this.routes = routes;
  }
}
