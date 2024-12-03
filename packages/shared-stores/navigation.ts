import { makeAutoObservable } from 'mobx';
import { Route, RouteBuilder } from '@shared/types';

export class Navigation {
  routeBuilders: RouteBuilder[] = [];
  constructor(routeBuilders: RouteBuilder[]) {
    this.routeBuilders = routeBuilders;
    makeAutoObservable(this, {}, { autoBind: true });
  }

  private findRouteByPath(pathname: string) {
    let findedRoute: Route;
    const findRoute = (route: Route) => {
      console.log('route', route.pathname, pathname);
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

  activateRoute() {
    const segments = window.location.pathname.split('/');

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
      if (segments.includes(route.pathname)) {
        route.active = true;
      } else {
        route.active = false;
      }

      route.children?.forEach(changeRouteActiveState);
    });
  }

  get routes(): Route[] {
    const convertRouteBuilderToRoute = (routeBuilder: RouteBuilder) => {
      const route: Route = {
        name: routeBuilder?.name,
        pathname: routeBuilder?.pathname,
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
        children: [],
      };

      if (routeBuilder.children) {
        route.children = routeBuilder.children.map(convertRouteBuilderToRoute);
      }

      return route;
    });

    return routes;
  }
}
