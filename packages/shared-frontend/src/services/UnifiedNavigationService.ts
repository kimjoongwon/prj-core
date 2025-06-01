import { type RouteBuilder, type Route } from '@shared/specs';
import { PathUtil } from '@shared/utils';
import { makeAutoObservable } from 'mobx';
import { NavigateFunction } from 'react-router';

/**
 * UnifiedNavigationService - 통합된 네비게이션 서비스
 * 라우트 관리, 네비게이션, 활성 상태 추적 등 모든 라우팅 관련 기능을 통합
 */
export class UnifiedNavigationService {
  private routes: Route[] = [];
  private routeBuilders: RouteBuilder[] = [];
  private flatRoutes: Map<string, RouteBuilder> = new Map();
  private navigateFunction?: NavigateFunction;

  constructor(routeBuilders: RouteBuilder[] = []) {
    this.setRoutes(routeBuilders);
    this.activateRoute(window.location.pathname);
    makeAutoObservable(this);
  }

  // ===== 네비게이션 함수 관리 =====
  
  /**
   * React Router의 navigate 함수 설정
   */
  setNavigateFunction(navigateFunction: NavigateFunction): void {
    this.navigateFunction = navigateFunction;
  }

  // ===== 라우트 데이터 관리 =====
  
  /**
   * 라우트 빌더 설정 및 초기화
   */
  setRoutes(routeBuilders: RouteBuilder[]): void {
    this.routeBuilders = routeBuilders;
    this.generateRoutesFromBuilders();
    this.flattenRoutes(routeBuilders);
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
          pathname: fullPath
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
   * 경로로 라우트 검색
   */
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

  /**
   * 라우트 경로 가져오기
   */
  getPathByName(name: string): string | undefined {
    const route = this.getRouteByName(name);
    return route?.pathname;
  }

  /**
   * 현재 활성화된 서비스 라우트 가져오기
   */
  get servicesRoute(): Route | undefined {
    return this.findRouteByPath('/admin/main/tenants/:tenantId/services');
  }

  /**
   * 현재 활성화된 서비스 라우트 가져오기
   */
  get activeServiceRoute(): Route | undefined {
    return this.servicesRoute?.children?.find(route => route.active);
  }

  /**
   * 모든 라우트 데이터 반환 (시각화 용도)
   */
  getAllRoutes(): RouteBuilder[] {
    return this.routeBuilders;
  }

  /**
   * 생성된 라우트 트리 반환
   */
  getGeneratedRoutes(): Route[] {
    return this.routes;
  }

  // ===== 네비게이션 기능 =====
  
  /**
   * 경로 네비게이션
   */
  push(
    pathname: string,
    pathParams?: object,
    searchParams?: Record<string, string>,
  ): void {
    if (!this.navigateFunction) {
      console.warn('NavigateFunction이 설정되지 않았습니다. setNavigateFunction을 먼저 호출하세요.');
      return;
    }

    let urlSearchParams;
    if (searchParams) {
      urlSearchParams = new URLSearchParams(searchParams).toString();
    }
    
    const pathnameWithSearchParams = PathUtil.getUrlWithParamsAndQueryString(
      pathname,
      pathParams,
      urlSearchParams,
    );
    
    this.navigateFunction(pathnameWithSearchParams);
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
    routeNameIfFalse: string
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
        
        if (route.pathname === targetPath || targetPath.includes(route.pathname)) {
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
}

// 싱글톤 인스턴스 생성
export const unifiedNavigationService = new UnifiedNavigationService();
