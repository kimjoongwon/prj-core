import { type RouteBuilder, type Route } from '@shared/types';
import { makeAutoObservable } from 'mobx';
import { type NavigateFunction } from 'react-router';
import { NavigatorService } from './navigator';

// Next.js와 React Router 모두 지원하기 위한 타입
type UniversalNavigateFunction = NavigateFunction | ((path: string) => void);

/**
 * NavigationService - 통합된 네비게이션 서비스
 * 라우트 관리, 네비게이션, 활성 상태 추적 등 모든 라우팅 관련 기능을 통합
 */
export class NavigationService {
  private _routes: Route[] = [];
  private _routeBuilders: RouteBuilder[] = [];
  private flatRoutes: Map<string, RouteBuilder> = new Map();
  private navigator: NavigatorService;

  // 현재 경로 추적을 위한 observable 프로퍼티들
  private _currentFullPath: string = '';
  private _currentRelativePath: string = '';

  // 선택된 대시보드 라우트 추적
  private _selectedDashboardRoute: RouteBuilder | null = null;

  constructor(routeBuilders: RouteBuilder[] = []) {
    this.navigator = new NavigatorService();
    this.setRoutes(routeBuilders);
    if (typeof window !== 'undefined' && window.location) {
      this.activateRoute(window.location.pathname);
      // 초기화 시에도 대시보드 라우트 선택 상태 설정
      this.updateSelectedDashboardRoute(window.location.pathname);
    }
    makeAutoObservable(this);
  }

  // ===== 현재 경로 추적 관리 =====

  /**
   * 현재 경로들을 업데이트 (절대경로와 상대경로)
   */
  private updateCurrentPaths(fullPath: string): void {
    this._currentFullPath = fullPath;
    this._currentRelativePath = this.extractRelativePath(fullPath);
  }

  /**
   * 절대 경로에서 마지막 세그먼트를 추출하여 상대 경로로 변환
   */
  private extractRelativePath(fullPath: string): string {
    if (!fullPath) return '';

    const segments = fullPath.split('/').filter(s => s.length > 0);
    return segments.length > 0 ? segments[segments.length - 1] : '';
  }

  /**
   * 현재 절대 경로 반환
   */
  get currentFullPath(): string {
    return this._currentFullPath;
  }

  /**
   * 현재 상대 경로 반환 (마지막 세그먼트)
   */
  get currentRelativePath(): string {
    return this._currentRelativePath;
  }

  /**
   * 선택된 대시보드 라우트 반환
   */
  get selectedDashboardRoute(): RouteBuilder | null {
    return this._selectedDashboardRoute;
  }

  /**
   * 대시보드 라우트 선택 설정
   */
  setSelectedDashboardRoute(route: RouteBuilder | null): void {
    this._selectedDashboardRoute = route;
  }

  /**
   * 선택된 대시보드 라우트의 자식 라우트들 반환 (Route 타입)
   */
  getSelectedDashboardRouteChildren(): Route[] {
    if (!this._selectedDashboardRoute) return [];
    const routeBuilders = this.createChildRoutes(this._selectedDashboardRoute);
    return this.convertRouteBuilderArrayToRoutes(routeBuilders);
  }

  /**
   * 현재 경로 정보를 수동으로 업데이트
   */
  setCurrentPath(fullPath: string): void {
    this.activateRoute(fullPath);
    this.updateSelectedDashboardRoute(fullPath);
  }

  // ===== 네비게이션 함수 관리 =====

  /**
   * React Router의 navigate 함수 또는 Next.js router.push 설정
   */
  setNavigateFunction(navigateFunction: UniversalNavigateFunction): void {
    this.navigator.setNavigateFunction(navigateFunction);
  }

  /**
   * NavigatorService 인스턴스 반환
   */
  getNavigator(): NavigatorService {
    return this.navigator;
  }

  // ===== 라우트 데이터 관리 =====

  /**
   * 라우트 빌더 설정 및 초기화
   */
  setRoutes(routeBuilders: RouteBuilder[]): void {
    this._routeBuilders = routeBuilders;
    this.generateRoutesFromBuilders();
    this.flattenRoutes(routeBuilders);
    this.navigator.setRouteNameResolver(this.getPathByName.bind(this));

    // 디버깅: flatRoutes 출력
    console.log('🔍 flatRoutes after setRoutes:');
    Array.from(this.flatRoutes.entries()).forEach(([name, route]) => {
      console.log(
        `  ${name} -> ${route.pathname} (children: ${
          route.children?.length || 0
        })`,
      );
    });
  }

  /**
   * 라우트 빌더에서 라우트 생성
   */
  generateRoutesFromBuilders(): void {
    const convertRouteBuilderToRoute = (
      routeBuilder: RouteBuilder,
      parentPath: string = '',
    ): Route => {
      const fullPath = this.combinePaths(
        parentPath,
        routeBuilder?.pathname || '',
      );

      return {
        name: routeBuilder?.name || '',
        pathname: fullPath,
        params: routeBuilder?.params,
        active: false,
        children:
          routeBuilder?.children?.map(child =>
            convertRouteBuilderToRoute(child, fullPath),
          ) || [],
      };
    };

    this._routes =
      this.routeBuilders?.map(builder => convertRouteBuilderToRoute(builder)) ||
      [];
  }

  /**
   * 라우트 트리를 평탄화하여 name을 키로 사용하는 맵 생성
   */
  private flattenRoutes(routes: RouteBuilder[], parentPath: string = ''): void {
    routes.forEach(route => {
      const fullPath = this.combinePaths(parentPath, route.pathname || '');

      if (route.name) {
        this.flatRoutes.set(route.name, {
          ...route,
          pathname: fullPath,
        });
      }

      if (route.children && route.children.length > 0) {
        this.flattenRoutes(route.children, fullPath);
      }
    });
  }

  // ===== 라우트 검색 및 조회 =====

  /**
   * 이름으로 라우트 검색
   */
  getRouteByName(name: string): RouteBuilder | undefined {
    return this.flatRoutes.get(name);
  }

  // ===== 헬퍼 함수들 (중복 로직 제거) =====

  /**
   * 경로를 정규화 (슬래시 제거 및 통일)
   */
  private normalizePath(pathname: string): string {
    if (!pathname) return '';
    return pathname.startsWith('/') ? pathname.slice(1) : pathname;
  }

  /**
   * 라우트 경로 매칭 (통합된 매칭 로직)
   */
  private findRouteByPath(pathname: string): RouteBuilder | undefined {
    if (!pathname) return undefined;

    const normalizedPath = this.normalizePath(pathname);

    return Array.from(this.flatRoutes.values()).find(route => {
      if (!route.pathname) return false;

      const routeNormalizedPath = this.normalizePath(route.pathname);

      return (
        // 정확한 매칭
        routeNormalizedPath === normalizedPath ||
        route.pathname === pathname ||
        // 경로 끝부분 매칭
        route.pathname?.endsWith(`/${normalizedPath}`) ||
        routeNormalizedPath?.endsWith(`/${normalizedPath}`) ||
        // 세그먼트 매칭
        this.matchesPathSegment(route.pathname, pathname)
      );
    });
  }

  /**
   * 경로 세그먼트 매칭 헬퍼 함수
   */
  private matchesPathSegment(routePath: string, searchPath: string): boolean {
    if (!routePath || !searchPath) return false;

    if (searchPath.startsWith('/')) {
      const searchSegments = searchPath.split('/').filter(s => s.length > 0);
      const routeSegments = routePath.split('/').filter(s => s.length > 0);

      if (searchSegments.length > 0 && routeSegments.length > 0) {
        return (
          routeSegments[routeSegments.length - 1] ===
          searchSegments[searchSegments.length - 1]
        );
      }
    }

    return false;
  }

  /**
   * 자식 라우트 생성 헬퍼 함수 (중복 제거)
   */
  private createChildRoutes(parentRoute: RouteBuilder): RouteBuilder[] {
    if (!parentRoute?.children) return [];

    return parentRoute.children.map(child => ({
      ...child,
      pathname: this.combinePaths(
        parentRoute.pathname || '',
        child.pathname || '',
      ),
    }));
  }

  /**
   * 경로로 직계 자식 라우트들 가져오기 (RouteBuilder 타입 - 내부용)
   */
  private getDirectChildrenByPathInternal(pathname: string): RouteBuilder[] {
    const targetRoute = this.findRouteByPath(pathname);
    return targetRoute ? this.createChildRoutes(targetRoute) : [];
  }

  /**
   * 경로로 직계 자식 라우트들 가져오기 (Route 타입)
   * 절대경로(/admin/dashboard) 또는 상대경로(dashboard) 모두 지원
   */
  getDirectChildrenByPath(pathname: string): Route[] {
    const routeBuilders = this.getDirectChildrenByPathInternal(pathname);
    return this.convertRouteBuilderArrayToRoutes(routeBuilders);
  }

  /**
   * 라우트 이름으로 직계 자식 라우트들 가져오기 (Route 타입)
   */
  getDirectChildrenByName(routeName: string): Route[] {
    const targetRoute = this.getRouteByName(routeName);
    if (!targetRoute) return [];
    const routeBuilders = this.createChildRoutes(targetRoute);
    return this.convertRouteBuilderArrayToRoutes(routeBuilders);
  }

  /**
   * 라우트 이름으로 경로 가져오기
   */
  getPathByName(name: string): string | undefined {
    const route = this.getRouteByName(name);
    return route?.pathname;
  }

  /**
   * 현재 경로 기준으로 브레드크럼의 마지막 라우트의 직계 자식들 반환 (Route 타입)
   */
  getDirectChildrenFromBreadcrumb(currentPathname: string): Route[] {
    const breadcrumbs = this.getBreadcrumbPath(currentPathname);

    if (breadcrumbs.length === 0) {
      return [];
    }

    // 현재 경로의 부모 라우트를 찾는다.
    // 경로 깊이가 2 이상이라면 마지막에서 두 번째 요소를, 그 외에는 마지막 요소를 사용한다.
    const parentRoute =
      breadcrumbs.length > 2
        ? breadcrumbs[breadcrumbs.length - 2]
        : breadcrumbs[breadcrumbs.length - 1];

    if (parentRoute && parentRoute.children) {
      return parentRoute.children.map(child => ({
        name: child.name,
        pathname: this.combinePaths(
          parentRoute.pathname || '',
          child.pathname || '',
        ),
        active: child.active || false,
        children: child.children,
        params: child.params,
        icon: child.icon,
      })) as Route[];
    }

    return [];
  }

  /**
   * @deprecated getCurrentRoutes 대신 getDirectChildrenFromBreadcrumb 사용
   */
  getCurrentRoutes(currentPathname: string): Route[] {
    console.warn(
      'getCurrentRoutes는 deprecated입니다. getDirectChildrenFromBreadcrumb을 사용하세요.',
    );
    return this.getDirectChildrenFromBreadcrumb(currentPathname);
  }

  /**
   * 조건부 네비게이션에 사용할 경로 계산
   */
  getConditionalPath(
    condition: boolean,
    routeNameIfTrue: string,
    routeNameIfFalse: string,
  ): string | undefined {
    return condition
      ? this.getPathByName(routeNameIfTrue)
      : this.getPathByName(routeNameIfFalse);
  }

  // ===== 활성 상태 관리 =====

  /**
   * 현재 경로에 따라 라우트 활성 상태 업데이트
   */
  activateRoute(currentPathname: string): void {
    // 현재 경로 업데이트
    this.updateCurrentPaths(currentPathname);

    const changeRouteActiveState = (route: Route) => {
      // 더 정확한 활성화 매칭 로직
      route.active =
        currentPathname === route.pathname ||
        currentPathname.startsWith(route.pathname + '/');
      route.children?.forEach(changeRouteActiveState);
    };

    this.routes?.forEach(changeRouteActiveState);
  }

  /**
   * Route 객체 배열 반환 (활성 상태가 포함된)
   */
  get routes(): Route[] {
    return this._routes;
  }

  /**
   * Route 객체 저장
   */
  private set routes(routes: Route[]) {
    this._routes = routes;
  }

  /**
   * 현재 활성화된 Route들 반환 (MobX observable)
   */
  getActiveRoutes(): Route[] {
    const activeRoutes: Route[] = [];

    const findActiveRoutes = (routes: Route[]) => {
      routes.forEach(route => {
        if (route.active) {
          activeRoutes.push(route);
        }
        if (route.children) {
          findActiveRoutes(route.children);
        }
      });
    };

    findActiveRoutes(this._routes);
    return activeRoutes;
  }

  /**
   * 이름으로 활성화된 Route 검색
   */
  getActiveRouteByName(name: string): Route | undefined {
    return this.getActiveRoutes().find(route => route.name === name);
  }

  /**
   * 네비게이션 시 대시보드 라우트 선택 상태 업데이트
   */
  private updateSelectedDashboardRoute(pathname: string): void {
    // 대시보드 라우트들 가져오기 (내부 RouteBuilder 메서드 사용)
    const dashboardRoutes = this.getDirectChildrenByPathInternal('dashboard');

    // 현재 경로가 대시보드 라우트 중 하나와 매칭되는지 확인
    const matchingDashboardRoute = dashboardRoutes.find(route => {
      if (!route.pathname) return false;
      return pathname.startsWith(route.pathname);
    });

    if (matchingDashboardRoute) {
      this.setSelectedDashboardRoute(matchingDashboardRoute);
    }
  }

  // ===== 유틸리티 메서드 =====

  /**
   * 경로 결합 헬퍼 함수
   */
  private combinePaths(parent: string, child: string): string {
    if (!parent) return child;
    if (!child) return parent;

    // 중복된 '/' 제거
    return `${parent.endsWith('/') ? parent.slice(0, -1) : parent}${
      child.startsWith('/') ? child : `/${child}`
    }`;
  }

  /**
   * 브레드크럼 경로 생성
   */
  getBreadcrumbPath(currentPathname: string): Route[] {
    const breadcrumbs: Route[] = [];

    const findPath = (routes: Route[], targetPath: string): boolean => {
      for (const route of routes) {
        // 현재 라우트의 경로가 타겟 경로의 시작 부분과 일치하는지 확인
        if (
          targetPath === route.pathname ||
          targetPath.startsWith(route.pathname + '/')
        ) {
          breadcrumbs.push(route);

          // 정확히 일치하면 완료
          if (targetPath === route.pathname) {
            return true;
          }

          // 자식 라우트에서 계속 찾기
          if (route.children && findPath(route.children, targetPath)) {
            return true;
          }

          // 자식에서 찾지 못했으면 현재 라우트를 제거
          breadcrumbs.pop();
        }
      }
      return false;
    };

    findPath(this._routes, currentPathname);
    return breadcrumbs;
  }

  /**
   * 디버깅용 플랫 라우트 맵 출력
   */
  debugFlatRoutes(): Map<string, RouteBuilder> {
    return this.flatRoutes;
  }

  /**
   * 라우트 빌더 목록 조회
   */
  get routeBuilders(): RouteBuilder[] {
    return this._routeBuilders;
  }

  /**
   * 현재 경로의 자식 Route들을 가져오기 (active 상태 포함)
   */
  getChildRoutesFromCurrentPath(): Route[] {
    if (typeof window === 'undefined') return [];

    const currentPath = this._currentFullPath || window.location.pathname;
    return this.getDirectChildrenByPath(currentPath);
  }

  /**
   * 경로로 직계 자식 Route들 가져오기 (active 상태 포함)
   */
  getDirectChildRoutesByPath(pathname: string): Route[] {
    const findRouteInRoutes = (
      routes: Route[],
      targetPath: string,
    ): Route | undefined => {
      for (const route of routes) {
        if (
          route.pathname === targetPath ||
          targetPath.startsWith(route.pathname + '/')
        ) {
          return route;
        }
        if (route.children) {
          const found = findRouteInRoutes(route.children, targetPath);
          if (found) return found;
        }
      }
      return undefined;
    };

    const targetRoute = findRouteInRoutes(this._routes, pathname);
    return targetRoute?.children || [];
  }

  /**
   * RouteBuilder를 Route로 변환하여 반환 (active 상태 포함)
   */
  convertRouteBuilderToRoute(
    routeBuilder: RouteBuilder,
    parentPath: string = '',
  ): Route {
    const fullPath = this.combinePaths(
      parentPath,
      routeBuilder?.pathname || '',
    );
    const currentPath =
      this._currentFullPath ||
      (typeof window !== 'undefined' ? window.location.pathname : '');

    return {
      name: routeBuilder?.name || '',
      pathname: fullPath,
      params: routeBuilder?.params,
      active:
        currentPath === fullPath || currentPath.startsWith(fullPath + '/'),
      icon: routeBuilder?.icon,
      children:
        routeBuilder?.children?.map(child =>
          this.convertRouteBuilderToRoute(child, fullPath),
        ) || [],
    };
  }

  /**
   * RouteBuilder 배열을 Route 배열로 변환 (active 상태 포함)
   */
  convertRouteBuilderArrayToRoutes(routeBuilders: RouteBuilder[]): Route[] {
    return routeBuilders.map(builder =>
      this.convertRouteBuilderToRoute(builder),
    );
  }

  /**
   * 라우트 배열의 활성화 상태를 업데이트
   */
  updateRoutesActiveState(routes: Route[]): Route[] {
    const currentPath =
      this._currentFullPath ||
      (typeof window !== 'undefined' ? window.location.pathname : '');

    const updateActive = (routeList: Route[]): Route[] => {
      return routeList.map(route => ({
        ...route,
        active:
          currentPath === route.pathname ||
          currentPath.startsWith(route.pathname + '/'),
        children: route.children ? updateActive(route.children) : undefined,
      }));
    };

    return updateActive(routes);
  }

  /**
   * 현재 추적 중인 경로를 기반으로 스마트하게 자식 Route 가져오기
   */
  getSmartChildRoutesFromCurrentPath(): Route[] {
    if (typeof window === 'undefined') return [];

    const currentPath = this._currentFullPath || window.location.pathname;
    return this.getSmartChildRoutes(currentPath);
  }

  /**
   * 현재 경로의 자식 Route들을 스마트하게 가져오기 (Route 타입 반환)
   * @deprecated getSmartChildRoutes를 사용하세요 (이제 Route를 직접 반환함)
   */
  getSmartChildRoutesAsRoute(pathname: string): Route[] {
    console.warn(
      'getSmartChildRoutesAsRoute는 deprecated입니다. getSmartChildRoutes를 사용하세요.',
    );
    return this.getSmartChildRoutes(pathname);
  }
  /**
   * 현재 경로의 자식 라우트들을 스마트하게 가져오기 (Route 타입)
   * 여러 단계의 매칭 전략을 통해 가장 적절한 자식 라우트들을 반환
   */
  getSmartChildRoutes(pathname: string): Route[] {
    console.log('🔍 getSmartChildRoutes called with:', pathname);
    if (!pathname) return [];

    const normalizedPath = this.normalizePath(pathname);
    console.log('📍 Normalized path:', normalizedPath);

    // 디버깅: 사용 가능한 라우트 출력
    console.log('🗂️ Available flatRoutes:');
    Array.from(this.flatRoutes.entries()).forEach(([name, route]) => {
      console.log(
        `  ${name}: ${route.pathname} (children: ${
          route.children?.length || 0
        })`,
      );
    });

    // 1단계: 정확한 경로 매칭
    const exactMatch = this.tryExactMatch(normalizedPath);
    if (exactMatch.length > 0)
      return this.convertRouteBuilderArrayToRoutes(exactMatch);

    // 2단계: 부분 경로 매칭 (접두사 매칭)
    const partialMatch = this.tryPartialMatch(normalizedPath);
    if (partialMatch.length > 0)
      return this.convertRouteBuilderArrayToRoutes(partialMatch);

    // 3단계: 세그먼트 기반 매칭
    const segmentMatch = this.trySegmentMatch(normalizedPath);
    if (segmentMatch.length > 0)
      return this.convertRouteBuilderArrayToRoutes(segmentMatch);

    // 4단계: 폴백 - 내부 RouteBuilder 메서드 사용
    console.log('🔄 Trying fallback with internal method...');
    const fallbackResult = this.getDirectChildrenByPathInternal(normalizedPath);
    if (fallbackResult.length > 0) {
      console.log(
        '✅ Found with fallback method:',
        fallbackResult.map(r => ({ name: r.name, pathname: r.pathname })),
      );
      return this.convertRouteBuilderArrayToRoutes(fallbackResult);
    }

    console.log('❌ No matching routes found');
    return [];
  }

  /**
   * 정확한 경로 매칭 시도
   */
  private tryExactMatch(normalizedPath: string): RouteBuilder[] {
    const exactMatchingRoute = Array.from(this.flatRoutes.values()).find(
      route => {
        if (!route.pathname) return false;
        const routeNormalizedPath = this.normalizePath(route.pathname);
        const isExactMatch = routeNormalizedPath === normalizedPath;
        console.log(
          `  Exact match check: "${routeNormalizedPath}" === "${normalizedPath}" -> ${isExactMatch}`,
        );
        return isExactMatch;
      },
    );

    if (exactMatchingRoute?.children) {
      console.log(
        `✅ Found exact matching route: "${exactMatchingRoute.name}" with ${exactMatchingRoute.children.length} children`,
      );
      const children = this.createChildRoutes(exactMatchingRoute);
      console.log(
        '🎯 Returning exact match children:',
        children.map(c => ({ name: c.name, pathname: c.pathname })),
      );
      return children;
    }
    return [];
  }

  /**
   * 부분 경로 매칭 시도 (접두사 매칭)
   */
  private tryPartialMatch(normalizedPath: string): RouteBuilder[] {
    console.log('🔄 Trying partial path matching...');

    const partialMatchingRoutes = Array.from(this.flatRoutes.values()).filter(
      route => {
        if (!route.pathname || !route.children?.length) return false;

        const routeNormalizedPath = this.normalizePath(route.pathname);
        const isPartialMatch =
          routeNormalizedPath === normalizedPath ||
          normalizedPath.startsWith(routeNormalizedPath + '/') ||
          normalizedPath.startsWith(routeNormalizedPath);

        console.log(
          `  Partial match check: "${normalizedPath}" matches "${routeNormalizedPath}" -> ${isPartialMatch}`,
        );
        return isPartialMatch;
      },
    );

    if (partialMatchingRoutes.length > 0) {
      // 가장 긴 매치를 찾기 (가장 구체적인 라우트)
      const bestMatch = partialMatchingRoutes.reduce((best, current) => {
        const bestLen = best.pathname?.length || 0;
        const currentLen = current.pathname?.length || 0;
        return currentLen > bestLen ? current : best;
      });

      console.log(
        `✅ Found best partial matching route: "${bestMatch.name}" with ${bestMatch.children?.length} children`,
      );
      const children = this.createChildRoutes(bestMatch);
      console.log(
        '🎯 Returning partial match children:',
        children.map(c => ({ name: c.name, pathname: c.pathname })),
      );
      return children;
    }
    return [];
  }

  /**
   * 세그먼트 기반 매칭 시도
   */
  private trySegmentMatch(normalizedPath: string): RouteBuilder[] {
    console.log('🔄 Trying segment-based matching...');
    const segments = normalizedPath.split('/').filter(s => s.length > 0);
    console.log('📍 Path segments:', segments);

    for (let i = segments.length - 1; i >= 0; i--) {
      const segment = segments[i];
      console.log(`🔎 Checking segment: "${segment}"`);

      const segmentMatchingRoute = Array.from(this.flatRoutes.values()).find(
        route => {
          if (!route.pathname || !route.children?.length) return false;

          const routeNormalizedPath = this.normalizePath(route.pathname);
          const routeSegments = routeNormalizedPath
            .split('/')
            .filter(s => s.length > 0);
          const lastRouteSegment = routeSegments[routeSegments.length - 1];
          const isSegmentMatch = lastRouteSegment === segment;

          console.log(
            `  Route "${route.name}" (${routeNormalizedPath}): lastSegment="${lastRouteSegment}" vs segment="${segment}" -> ${isSegmentMatch}`,
          );
          return isSegmentMatch;
        },
      );

      if (segmentMatchingRoute) {
        console.log(
          `✅ Found segment matching route: "${segmentMatchingRoute.name}" with ${segmentMatchingRoute.children?.length} children`,
        );
        const children = this.createChildRoutes(segmentMatchingRoute);
        console.log(
          '🎯 Returning segment match children:',
          children.map(c => ({ name: c.name, pathname: c.pathname })),
        );
        return children;
      }
    }
    return [];
  }

  /**
   * 경로 세그먼트를 기반으로 가장 적절한 부모 라우트의 직계 자식들 찾기
   * 예: '/admin/dashboard/users' -> 'dashboard'의 직계 자식들 반환
   * @deprecated getSmartChildRoutes 사용을 권장합니다.
   */
  getDirectChildrenByPathSegments(pathname: string): Route[] {
    console.warn(
      'getDirectChildrenByPathSegments는 deprecated입니다. getSmartChildRoutes를 사용하세요.',
    );
    return this.getSmartChildRoutes(pathname);
  }
}
