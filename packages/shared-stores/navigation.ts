import { makeAutoObservable, reaction } from 'mobx';
import { Route, RouteBuilder } from '@shared/types';

export class Navigation {
  routeBuilders: RouteBuilder[] = [];
  currentPathname: string = '';
  routes: Route[] = [];
  constructor(routeBuilders: RouteBuilder[]) {
    this.routeBuilders = routeBuilders;
    this.getRoutes()
    makeAutoObservable(this, {}, { autoBind: true });

    reaction(
      () => this.currentPathname,
      () => {
        this.activateRoute();
      },
    );
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
    const serviceRoute = this.servicesRoute?.children?.find(
      serviceRoute => serviceRoute.active,
    );

    console.log('serviceRoute', serviceRoute);

    return serviceRoute;
  }

  activateRoute() {
    const segments = window.location.pathname.split('/');
    const changeRouteActiveState = (route: Route) => {
      if (segments.includes(route.pathname)) {
        console.log('active-1', route.pathname);
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
        console.log('active2', route.pathname);
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

    this.routes = routes;
  }
}
