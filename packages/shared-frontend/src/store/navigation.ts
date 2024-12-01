import { makeAutoObservable } from 'mobx';
import { Route, RouteBuilder } from '@shared/types';

export class Navigation {
  routes: Route[] = [];

  constructor(routes: RouteBuilder[]) {
    this.routes = this.buildRouteTree(routes);
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get navItems() {
    return this.routes.find(route => route.pathname === '/admin/main')
      ?.children;
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

  push(pathname: string, params: object) {
    this.push(pathname, params);
  }

  buildRouteTree(routes: RouteBuilder[]): Route[] {
    // 경로 길이순으로 정렬
    const sortedRoutes = [...routes].sort(
      (a, b) => a.pathname.split('/').length - b.pathname.split('/').length,
    );

    const result: Route[] = [];

    sortedRoutes.forEach(route => {
      const currentPath = route.pathname;

      // 부모 경로 찾기
      const parentRoute = result.find(
        r => r.pathname !== currentPath && currentPath.startsWith(r.pathname),
      );

      if (parentRoute) {
        // 부모가 있으면 children 배열에 추가
        parentRoute.children = parentRoute.children || [];
        parentRoute.children.push({ ...route });
      } else {
        // 부모가 없으면 최상위 레벨에 추가
        result.push({ ...route });
      }
    });

    return result;
  }
}
