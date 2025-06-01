import { RouteBuilder } from '@shared/specs';

/**
 * RouteNavigator - 라우트 이름 기준 네비게이션 서비스
 * 라우트 빌더의 name을 사용하여 탐색하고 조건부 라우팅 로직을 구현할 수 있습니다.
 */
export class RouteNavigator {
  private routes: RouteBuilder[] = [];
  private flatRoutes: Map<string, RouteBuilder> = new Map();
  
  /**
   * 라우트 데이터 초기화
   */
  setRoutes(routes: RouteBuilder[]): void {
    this.routes = routes;
    this.flattenRoutes(routes);
  }
  
  /**
   * 이름으로 라우트 검색
   */
  getRouteByName(name: string): RouteBuilder | undefined {
    return this.flatRoutes.get(name);
  }
  
  /**
   * 라우트 경로 가져오기
   */
  getPathByName(name: string): string | undefined {
    const route = this.getRouteByName(name);
    return route?.pathname;
  }
  
  /**
   * 조건부 네비게이션
   * @param condition 조건
   * @param routeNameIfTrue 조건이 참일 경우 이동할 라우트 이름
   * @param routeNameIfFalse 조건이 거짓일 경우 이동할 라우트 이름
   * @returns 이동할 경로
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
   * 라우트 트리를 평탄화하여 name을 키로 사용하는 맵 생성
   */
  private flattenRoutes(routes: RouteBuilder[], parentPath: string = ''): void {
    routes.forEach(route => {
      if (route.name) {
        this.flatRoutes.set(route.name, {
          ...route,
          pathname: this.combinePaths(parentPath, route.pathname || '')
        });
      }
      
      if (route.children && route.children.length > 0) {
        this.flattenRoutes(
          route.children,
          this.combinePaths(parentPath, route.pathname || '')
        );
      }
    });
  }
  
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
   * 모든 라우트 데이터 반환 (시각화 용도)
   */
  getAllRoutes(): RouteBuilder[] {
    return this.routes;
  }
}

// 싱글톤 인스턴스 생성
export const routeNavigator = new RouteNavigator();
