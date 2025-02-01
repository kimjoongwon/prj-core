import { type RouteBuilder, type Route } from '@shared/types';
import { PathUtil } from '@shared/utils';
import { makeAutoObservable } from 'mobx';

type NavigateFunction = (pathnameWithSearchParams: string) => void;

export class Navigation {
  routeBuilders: RouteBuilder[] = [];
  routes: Route[] = [];
  navigateFunction?: NavigateFunction;

  constructor(routeBuilders: RouteBuilder[]) {
    this.routeBuilders = routeBuilders;
    this.getRoutes();
    this.activateRoute(window.location.pathname);
    makeAutoObservable(this);
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

    window.history.pushState({}, '', pathnameWithSearchParams);
  }

  private findRouteByPath(pathname: string): Route | undefined {
    const findRoute = (routes: Route[]): Route | undefined => {
      for (const route of routes) {
        if (route.pathname === pathname) {
          return route;
        }
        const found = route.children ? findRoute(route.children) : undefined;
        if (found) {
          return found;
        }
      }
      return undefined;
    };

    return findRoute(this.routes);
  }

  get servicesRoute() {
    const servicesRoute = this.findRouteByPath(
      '/admin/main/tenancies/:tenancyId/services',
    );
    return servicesRoute;
  }

  get serviceRoute() {
    const serviceRoute = this.servicesRoute?.children?.find(
      serviceRoute => serviceRoute.active,
    );

    return serviceRoute;
  }

  activateRoute(currentPathname: string) {
    const changeRouteActiveState = (route: Route) => {
      route.active = currentPathname?.includes(route.pathname);
      route.children?.forEach(changeRouteActiveState);
    };

    this.routes?.forEach(changeRouteActiveState);
  }

  getRoutes() {
    const convertRouteBuilderToRoute = (routeBuilder: RouteBuilder): Route => ({
      name: routeBuilder?.name || '',
      pathname: routeBuilder?.pathname || '',
      params: routeBuilder?.params,
      active: false,
      children: routeBuilder?.children?.map(convertRouteBuilderToRoute) || [],
    });

    this.routes = this.routeBuilders?.map(convertRouteBuilderToRoute);
  }
}
