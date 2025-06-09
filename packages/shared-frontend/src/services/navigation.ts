import { type RouteBuilder, type Route } from '@shared/types';
import { PathUtil } from '@shared/utils';
import { makeAutoObservable } from 'mobx';
import { type NavigateFunction } from 'react-router';
import { NavigatorService } from './navigator';

// Next.js와 React Router 모두 지원하기 위한 타입
type UniversalNavigateFunction = NavigateFunction | ((path: string) => void);

/**
 * UnifiedNavigationService - 통합된 네비게이션 서비스
 * 라우트 관리, 네비게이션, 활성 상태 추적 등 모든 라우팅 관련 기능을 통합
 */
export class UnifiedNavigationService {
  private routes: Route[] = [];
  private _routeBuilders: RouteBuilder[] = [];
  private flatRoutes: Map<string, RouteBuilder> = new Map();
  private navigator: NavigatorService;

  constructor(routeBuilders: RouteBuilder[] = []) {
    this.navigator = new NavigatorService();
    this.setRoutes(routeBuilders);
    this.activateRoute(window.location.pathname);
    makeAutoObservable(this);
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
    const convertRouteBuilderToRoute = (routeBuilder: RouteBuilder): Route => ({
      name: routeBuilder?.name || '',
      pathname: routeBuilder?.pathname || '',
      params: routeBuilder?.params,
      active: false,
      children: routeBuilder?.children?.map(convertRouteBuilderToRoute) || [],
    });

    this.routes = this.routeBuilders?.map(convertRouteBuilderToRoute) || [];
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

  /**
   * pathname으로 라우트의 children을 반환
   * 절대경로(/admin/dashboard) 또는 상대경로(dashboard) 모두 지원
   */
  getRoutesByPathname(pathname: string): RouteBuilder[] {
    // 정규화된 경로로 변환 (앞의 / 제거)
    const normalizedPath = pathname.startsWith('/')
      ? pathname.slice(1)
      : pathname;

    // flatRoutes에서 해당 pathname을 가진 라우트 찾기
    const targetRoute = Array.from(this.flatRoutes.values()).find(route => {
      if (!route.pathname) return false;

      // 정확한 매칭 (절대경로와 상대경로 모두 고려)
      const routeNormalizedPath = route.pathname.startsWith('/')
        ? route.pathname.slice(1)
        : route.pathname;

      return (
        // 정확한 매칭
        routeNormalizedPath === normalizedPath ||
        route.pathname === pathname ||
        // 상대경로로 끝나는 경우
        route.pathname?.endsWith(`/${normalizedPath}`) ||
        routeNormalizedPath?.endsWith(`/${normalizedPath}`) ||
        // 절대경로에서 세그먼트 매칭
        this.matchesPathSegment(route.pathname, pathname)
      );
    });

    if (targetRoute && targetRoute.children) {
      return targetRoute.children.map(child => ({
        ...child,
        pathname: this.combinePaths(
          targetRoute.pathname || '',
          child.pathname || '',
        ),
      }));
    }

    return [];
  }

  /**
   * 경로 세그먼트 매칭 헬퍼 함수
   * 절대경로에서 특정 세그먼트가 포함되어 있는지 확인
   */
  private matchesPathSegment(routePath: string, searchPath: string): boolean {
    if (!routePath || !searchPath) return false;

    // 절대경로인 경우 세그먼트로 분리하여 매칭
    if (searchPath.startsWith('/')) {
      const searchSegments = searchPath.split('/').filter(s => s.length > 0);
      const routeSegments = routePath.split('/').filter(s => s.length > 0);

      // 마지막 세그먼트가 일치하는지 확인
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
   * 라우트 이름으로 children을 반환
   */
  getRoutesByName(routeName: string): RouteBuilder[] {
    const targetRoute = this.getRouteByName(routeName);

    if (targetRoute && targetRoute.children) {
      return targetRoute.children.map(child => ({
        ...child,
        pathname: this.combinePaths(
          targetRoute.pathname || '',
          child.pathname || '',
        ),
      }));
    }

    return [];
  }

  /**
   * 라우트 이름으로 경로 가져오기
   */
  getPathByName(name: string): string | undefined {
    const route = this.getRouteByName(name);
    return route?.pathname;
  }

  /**
   * 현재 경로 기준으로 라우트 생성 (브레드크럼 기반)
   */
  getCurrentRoutes(currentPathname: string): RouteBuilder[] {
    const breadcrumbs = this.getBreadcrumbPath(currentPathname);

    if (breadcrumbs.length === 0) {
      return [];
    }

    // 현재 경로의 부모 라우트 찾기
    const parentRoute = breadcrumbs[breadcrumbs.length - 1];

    if (parentRoute && parentRoute.children) {
      return parentRoute.children.map(child => ({
        name: child.name,
        pathname: this.combinePaths(
          parentRoute.pathname || '',
          child.pathname || '',
        ),
        children: child.children,
      })) as RouteBuilder[];
    }

    return [];
  }

  /**
   * 경로 네비게이션
   */
  push(
    pathname: string,
    pathParams?: object,
    searchParams?: Record<string, string>,
  ): void {
    this.navigator.push(pathname, pathParams, searchParams);
  }

  /**
   * 이름으로 네비게이션
   */
  pushByName(
    routeName: string,
    pathParams?: object,
    searchParams?: Record<string, string>,
  ): void {
    const pathname = this.getPathByName(routeName);
    if (!pathname) {
      console.warn(`라우트 이름 "${routeName}"을 찾을 수 없습니다.`);
      return;
    }

    this.push(pathname, pathParams, searchParams);
  }

  /**
   * 조건부 네비게이션
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

  /**
   * 조건부 네비게이션 실행
   */
  pushConditional(
    condition: boolean,
    routeNameIfTrue: string,
    routeNameIfFalse: string,
    pathParams?: object,
    searchParams?: Record<string, string>,
  ): void {
    const routeName = condition ? routeNameIfTrue : routeNameIfFalse;
    this.pushByName(routeName, pathParams, searchParams);
  }

  // ===== 활성 상태 관리 =====

  /**
   * 현재 경로에 따라 라우트 활성 상태 업데이트
   */
  activateRoute(currentPathname: string): void {
    const changeRouteActiveState = (route: Route) => {
      route.active = currentPathname?.includes(route.pathname);
      route.children?.forEach(changeRouteActiveState);
    };

    this.routes?.forEach(changeRouteActiveState);
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
   * 현재 활성 라우트들 가져오기
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

    findActiveRoutes(this.routes);
    return activeRoutes;
  }

  /**
   * 브레드크럼 경로 생성
   */
  getBreadcrumbPath(currentPathname: string): Route[] {
    const breadcrumbs: Route[] = [];

    const findPath = (routes: Route[], targetPath: string): boolean => {
      for (const route of routes) {
        breadcrumbs.push(route);

        if (
          route.pathname === targetPath ||
          targetPath.includes(route.pathname)
        ) {
          if (route.children) {
            if (findPath(route.children, targetPath)) {
              return true;
            }
          } else {
            return true;
          }
        }

        breadcrumbs.pop();
      }
      return false;
    };

    findPath(this.routes, currentPathname);
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
   * 현재 브라우저 경로를 기반으로 자식 라우트를 자동으로 반환
   * window.location.pathname을 사용하여 현재 위치의 자식 메뉴를 가져옴
   */
  getChildRoutesFromCurrentPath(): RouteBuilder[] {
    if (typeof window === 'undefined') return [];

    const currentPath = window.location.pathname;
    return this.getRoutesByPathname(currentPath);
  }
  /**
   * 현재 경로의 자식 라우트들을 스마트하게 가져오기
   * 경로 세그먼트를 분석하여 가장 적절한 자식 라우트들을 반환
   */
  /**
   * 현재 경로의 자식 라우트들을 스마트하게 가져오기
   * 경로 세그먼트를 분석하여 가장 적절한 자식 라우트들을 반환
   */
  getSmartChildRoutes(pathname: string): RouteBuilder[] {
    console.log('🔍 getSmartChildRoutes called with:', pathname);

    if (!pathname) return [];

    // 정규화: 앞의 슬래시 제거
    const normalizedPath = pathname.startsWith('/')
      ? pathname.slice(1)
      : pathname;
    console.log('📍 Normalized path:', normalizedPath);

    // flatRoutes 디버깅
    console.log('🗂️ Available flatRoutes:');
    Array.from(this.flatRoutes.entries()).forEach(([name, route]) => {
      console.log(
        `  ${name}: ${route.pathname} (children: ${
          route.children?.length || 0
        })`,
      );
    });

    // 1단계: flatRoutes에서 정확히 매칭되는 라우트 찾기 (전체 경로 매칭)
    const exactMatchingRoute = Array.from(this.flatRoutes.values()).find(
      route => {
        if (!route.pathname) return false;

        // 라우트의 pathname도 정규화
        const routeNormalizedPath = route.pathname.startsWith('/')
          ? route.pathname.slice(1)
          : route.pathname;

        const isExactMatch = routeNormalizedPath === normalizedPath;
        console.log(
          `  Exact match check: "${routeNormalizedPath}" === "${normalizedPath}" -> ${isExactMatch}`,
        );

        return isExactMatch;
      },
    );

    if (exactMatchingRoute && exactMatchingRoute.children) {
      console.log(
        `✅ Found exact matching route: "${exactMatchingRoute.name}" with ${exactMatchingRoute.children.length} children`,
      );
      const children = exactMatchingRoute.children.map(child => ({
        ...child,
        pathname: this.combinePaths(
          exactMatchingRoute.pathname || '',
          child.pathname || '',
        ),
      }));
      console.log(
        '🎯 Returning exact match children:',
        children.map(c => ({ name: c.name, pathname: c.pathname })),
      );
      return children;
    }

    // 2단계: 부분 경로 매칭 - 라우트 경로가 현재 경로에 포함되는지 확인
    console.log('🔄 Trying partial path matching...');
    const partialMatchingRoutes = Array.from(this.flatRoutes.values()).filter(
      route => {
        if (!route.pathname) return false;

        const routeNormalizedPath = route.pathname.startsWith('/')
          ? route.pathname.slice(1)
          : route.pathname;

        // 라우트 경로가 현재 경로와 정확히 일치하거나, 현재 경로가 라우트 경로로 시작하는지 확인
        const isPartialMatch =
          routeNormalizedPath === normalizedPath ||
          normalizedPath.startsWith(routeNormalizedPath + '/') ||
          normalizedPath.startsWith(routeNormalizedPath);
        console.log(
          `  Partial match check: "${normalizedPath}" matches "${routeNormalizedPath}" -> ${isPartialMatch}`,
        );

        return isPartialMatch && route.children && route.children.length > 0;
      },
    );

    // 가장 긴 매치를 찾기 (가장 구체적인 라우트)
    if (partialMatchingRoutes.length > 0) {
      const bestMatch = partialMatchingRoutes.reduce((best, current) => {
        const bestLen = best.pathname?.length || 0;
        const currentLen = current.pathname?.length || 0;
        return currentLen > bestLen ? current : best;
      });

      console.log(
        `✅ Found best partial matching route: "${bestMatch.name}" with ${bestMatch.children.length} children`,
      );
      const children = bestMatch.children.map(child => ({
        ...child,
        pathname: this.combinePaths(
          bestMatch.pathname || '',
          child.pathname || '',
        ),
      }));
      console.log(
        '🎯 Returning partial match children:',
        children.map(c => ({ name: c.name, pathname: c.pathname })),
      );
      return children;
    }

    // 3단계: 세그먼트 기반 매칭 (마지막 세그먼트로 찾기)
    console.log('🔄 Trying segment-based matching...');
    const segments = normalizedPath.split('/').filter(s => s.length > 0);
    console.log('📍 Path segments:', segments);

    for (let i = segments.length - 1; i >= 0; i--) {
      const segment = segments[i];
      console.log(`🔎 Checking segment: "${segment}"`);

      // 해당 세그먼트로 끝나는 라우트 찾기
      const segmentMatchingRoute = Array.from(this.flatRoutes.values()).find(
        route => {
          if (!route.pathname) return false;

          const routeNormalizedPath = route.pathname.startsWith('/')
            ? route.pathname.slice(1)
            : route.pathname;

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

      if (segmentMatchingRoute && segmentMatchingRoute.children) {
        console.log(
          `✅ Found segment matching route: "${segmentMatchingRoute.name}" with ${segmentMatchingRoute.children.length} children`,
        );
        const children = segmentMatchingRoute.children.map(child => ({
          ...child,
          pathname: this.combinePaths(
            segmentMatchingRoute.pathname || '',
            child.pathname || '',
          ),
        }));
        console.log(
          '🎯 Returning segment match children:',
          children.map(c => ({ name: c.name, pathname: c.pathname })),
        );
        return children;
      }
    }

    // 4단계: 기존 getRoutesByPathname 로직 사용
    console.log('🔄 Trying fallback with getRoutesByPathname...');
    const fallbackResult = this.getRoutesByPathname(normalizedPath);
    if (fallbackResult.length > 0) {
      console.log(
        '✅ Found with fallback method:',
        fallbackResult.map(r => ({ name: r.name, pathname: r.pathname })),
      );
      return fallbackResult;
    }

    console.log('❌ No matching routes found');
    return [];
  }

  /**
   * 경로 세그먼트를 기반으로 가장 적절한 부모 라우트 찾기
   * 예: '/admin/dashboard/users' -> 'dashboard'의 자식들 반환
   */
  getRoutesByPathSegments(pathname: string): RouteBuilder[] {
    if (!pathname) return [];

    // 경로를 세그먼트로 분리
    const segments = pathname.split('/').filter(s => s.length > 0);

    // 각 세그먼트에 대해 라우트 찾기 (뒤에서부터)
    for (let i = segments.length - 1; i >= 0; i--) {
      const segment = segments[i];
      const routes = this.getRoutesByPathname(segment);

      if (routes.length > 0) {
        return routes;
      }

      // 부분 경로로도 시도
      const partialPath = segments.slice(0, i + 1).join('/');
      const partialRoutes = this.getRoutesByPathname(partialPath);

      if (partialRoutes.length > 0) {
        return partialRoutes;
      }
    }

    return [];
  }
}
