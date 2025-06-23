import { type RouteBuilder, type Route } from '@shared/types';
import { makeAutoObservable, runInAction } from 'mobx';
import { type NavigateFunction } from 'react-router';
import { type INavigationStore } from './navigatorStore';
import { type PlateStore } from './plateStore';

// Next.js와 React Router 모두 지원하기 위한 타입
type UniversalNavigateFunction = NavigateFunction | ((path: string) => void);

/**
 * NavigationStore - 통합된 네비게이션 스토어
 *
 * Route 객체를 원천으로 사용하여 라우트 관리, 네비게이션, 활성 상태 추적을 처리합니다.
 * fullPath(절대경로)와 relativePath(상대경로)를 명확히 구분하여 경로 혼동을 방지합니다.
 *
 * 주요 특징:
 * - RouteBuilder에서 Route로 변환된 객체를 단일 데이터 소스로 사용
 * - routes 배열을 통한 직접적인 라우트 검색
 * - 단순화된 경로 매칭 로직
 * - fullPath와 relativePath의 명확한 구분
 * - PlateStore를 통해 NavigatorStore에 접근
 */
export class NavigationStore implements INavigationStore {
  private _routes: Route[] = [];
  private plateStore: PlateStore;
  routeBuilders: RouteBuilder[] = [];
  currentRoute: Route | undefined = undefined;
  selectedDashboardFullPath: string | undefined = '';

  // 현재 경로 추적을 위한 observable 프로퍼티들
  currentFullPath: string = '';
  currentRelativePath: string = '';

  constructor(plateStore: PlateStore, routeBuilders: RouteBuilder[] = []) {
    this.plateStore = plateStore;
    this.routeBuilders = routeBuilders;
    this.setRoutes(routeBuilders);

    // 초기 경로 설정 - localStorage에서 복원하거나 현재 위치 사용
    this.initializeCurrentPath();

    makeAutoObservable(this, {
      routeBuilders: false, // routeBuilders는 외부에서 직접 수정하지 않도록 설정
    });
  }

  /**
   * 초기 경로 설정 - localStorage에서 복원하거나 현재 위치 사용
   */
  private initializeCurrentPath(): void {
    if (typeof window !== 'undefined') {
      let initialPath = window.location?.pathname || '';

      // localStorage에서 마지막 경로 복원 시도
      try {
        const savedPath = localStorage.getItem('navigationCurrentPath');
        if (savedPath && savedPath !== '/') {
          // 저장된 경로가 있고 루트가 아닌 경우, 현재 브라우저 경로와 비교
          // 브라우저 경로가 루트(/)이고 저장된 경로가 있으면 저장된 경로 사용
          if (initialPath === '/' || !initialPath) {
            initialPath = savedPath;
          }
        }
      } catch (error) {
        console.warn(
          'Failed to restore navigation path from localStorage:',
          error,
        );
      }

      if (initialPath) {
        this.updateCurrentPaths(initialPath);
      }
    }
  }

  /**
   * 현재 경로들을 업데이트 (절대경로와 상대경로)
   */
  private updateCurrentPaths(fullPath: string): void {
    this.currentFullPath = fullPath;
    this.currentRelativePath = this.extractRelativePath(fullPath);

    // localStorage에 현재 경로 저장
    if (typeof window !== 'undefined' && fullPath && fullPath !== '/') {
      try {
        localStorage.setItem('navigationCurrentPath', fullPath);
      } catch (error) {
        console.warn('Failed to save navigation path to localStorage:', error);
      }
    }
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
   * React Router의 navigate 함수 또는 Next.js router.push 설정
   */
  setNavigateFunction(navigateFunction: UniversalNavigateFunction): void {
    this.plateStore.navigator.setNavigateFunction(navigateFunction);
  }

  /**
   * NavigatorStore 인스턴스 반환
   */
  getNavigator() {
    return this.plateStore.navigator;
  }

  // ===== 라우트 데이터 관리 =====

  /**
   * 라우트 빌더 설정 및 초기화 - Route 객체 중심의 처리
   */
  setRoutes(routeBuilders: RouteBuilder[]): void {
    // 1. RouteBuilder → Route 변환
    this.generateRoutesFromBuilders(routeBuilders);

    // 2. Navigator에 라우트 이름 검색 함수 설정
    this.plateStore.navigator.setRouteNameResolver(this.getFullPathByName.bind(this));
  }

  /**
   * 라우트 빌더에서 라우트 생성 - Route 객체를 원천으로 사용
   */
  private generateRoutesFromBuilders(routeBuilders: RouteBuilder[]): void {
    const convertRouteBuilderToRoute = (
      routeBuilder: RouteBuilder,
      parentPath: string = '',
    ): Route => {
      // RouteBuilder가 pathname 속성을 사용하는 경우 relativePath로 처리 (테스트 호환성)
      const relativePath =
        routeBuilder.relativePath || (routeBuilder as any).pathname || '';

      // fullPath: 절대 경로 (부모 경로와 결합)
      const fullPath = this.combinePaths(parentPath, relativePath);

      const route: Route = {
        name: routeBuilder.name || '',
        fullPath: fullPath,
        relativePath: relativePath,
        params: routeBuilder.params,
        active: false,
        icon: routeBuilder.icon,
        children:
          routeBuilder.children?.map(child =>
            convertRouteBuilderToRoute(child, fullPath),
          ) || [],
      };

      return route;
    };

    this._routes = routeBuilders.map(builder =>
      convertRouteBuilderToRoute(builder),
    );
  }

  // ===== 라우트 검색 및 조회 =====

  /**
   * 이름으로 라우트 검색 - routes 원천에서 직접 검색
   */
  getRouteByName(name: string): Route | undefined {
    const findRouteByName = (routes: Route[]): Route | undefined => {
      for (const route of routes) {
        if (route.name === name) {
          return route;
        }
        if (route.children?.length > 0) {
          const found = findRouteByName(route.children);
          if (found) return found;
        }
      }
      return undefined;
    };

    return findRouteByName(this._routes);
  }

  /**
   * 라우트 이름으로 fullPath 가져오기
   */
  getFullPathByName(name: string): string | undefined {
    const route = this.getRouteByName(name);
    return route?.fullPath;
  }

  /**
   * fullPath로 라우트 검색 - routes 원천에서 직접 검색
   */
  private findRouteByFullPath(fullPath: string): Route | undefined {
    if (!fullPath) return undefined;

    const normalizedPath = this.normalizePath(fullPath);

    const findRoute = (routes: Route[]): Route | undefined => {
      for (const route of routes) {
        const routeNormalizedPath = this.normalizePath(route.fullPath);
        if (routeNormalizedPath === normalizedPath) {
          return route;
        }
        // 자식 라우트에서도 검색
        if (route.children?.length > 0) {
          const found = findRoute(route.children);
          if (found) return found;
        }
      }
      return undefined;
    };

    return findRoute(this._routes);
  }

  /**
   * fullPath로 직계 자식 라우트들 가져오기 (Route 타입)
   */
  getDirectChildrenByFullPath(fullPath: string): Route[] {
    const targetRoute = this.findRouteByFullPath(fullPath);
    if (!targetRoute?.children) return [];

    return targetRoute.children;
  }

  /**
   * 라우트 이름으로 직계 자식 라우트들 가져오기 (Route 타입)
   */
  getDirectChildrenByName(routeName: string): Route[] {
    const targetRoute = this.getRouteByName(routeName);
    if (!targetRoute?.children) return [];

    return targetRoute.children;
  }

  /**
   * 라우트 이름으로 경로 가져오기 (테스트 호환성을 위한 별칭)
   */
  getPathByName(name: string): string | undefined {
    return this.getFullPathByName(name);
  }

  /**
   * 현재 경로 설정 (테스트 및 수동 경로 설정용)
   */
  setCurrentPath(fullPath: string): void {
    this.updateCurrentPaths(fullPath);
    this.activateRoute(fullPath);
  }

  /**
   * 선택된 대시보드 라우트의 자식들 가져오기
   * routes 원천 데이터를 통해 현재 활성화된 대시보드 자식 라우트를 찾음
   */
  getSelectedDashboardRouteChildren(): Route[] {
    const dashboardRoute = this.getRouteByName('대시보드');
    if (!dashboardRoute?.children?.length) return [];

    // 현재 경로와 매칭되는 대시보드 자식 라우트 찾기
    const normalizedCurrentPath = this.normalizePath(this.currentFullPath);

    const matchingChild = dashboardRoute.children.find(child => {
      const normalizedChildPath = this.normalizePath(child.fullPath);
      return normalizedCurrentPath.startsWith(normalizedChildPath);
    });

    return matchingChild?.children || [];
  }

  /**
   * 선택된 대시보드 라우트의 부모 메뉴 정보 가져오기
   * CollapsibleSidebar에서 사용하는 parentMenuInfo를 계산
   */
  getParentMenuInfo(): {
    name: string;
    pathname: string;
    icon?: string;
  } | null {
    const dashboardRoute = this.getRouteByName('대시보드');
    if (!dashboardRoute?.children?.length) return null;

    // 현재 경로와 매칭되는 대시보드 자식 라우트 찾기 (선택된 대시보드 메뉴)
    const normalizedCurrentPath = this.normalizePath(this.currentFullPath);

    const selectedDashboardChild = dashboardRoute.children.find(child => {
      const normalizedChildPath = this.normalizePath(child.fullPath);
      return normalizedCurrentPath.startsWith(normalizedChildPath);
    });

    if (selectedDashboardChild) {
      return {
        name: selectedDashboardChild.name,
        pathname: selectedDashboardChild.fullPath,
        icon: selectedDashboardChild.icon,
      };
    }

    // fallback: 대시보드 라우트 자체 사용
    return {
      name: dashboardRoute.name,
      pathname: dashboardRoute.fullPath,
      icon: dashboardRoute.icon,
    };
  }

  // ===== 활성 상태 관리 =====

  /**
   * 현재 경로에 따라 라우트 활성 상태 업데이트
   * Route 객체 중심의 처리로 단순화
   */
  activateRoute(currentFullPath: string): void {
    this.updateCurrentPaths(currentFullPath);

    // 모든 라우트의 활성 상태 업데이트
    const updateActiveState = (route: Route) => {
      runInAction(() => {
        route.active = this.isRouteActive(currentFullPath, route.fullPath);
        route.children?.forEach(updateActiveState);
      });
    };

    this._routes.forEach(updateActiveState);
  }

  /**
   * 라우트가 현재 경로에 대해 활성 상태인지 확인 - 단순화된 로직
   */
  private isRouteActive(
    currentFullPath: string,
    routeFullPath: string,
  ): boolean {
    if (!currentFullPath || !routeFullPath) return false;

    const normalizedCurrent = this.normalizePath(currentFullPath);
    const normalizedRoute = this.normalizePath(routeFullPath);

    // 정확한 매칭
    if (normalizedCurrent === normalizedRoute) {
      return true;
    }

    // 하위 경로 매칭 (현재 경로가 라우트 경로의 하위인 경우)
    return normalizedCurrent.startsWith(normalizedRoute + '/');
  }

  /**
   * Route 객체 배열 반환 (활성 상태가 포함된)
   */
  get routes(): Route[] {
    return this._routes;
  }

  /**
   * 현재 활성화된 Route들 반환
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

  // ===== 유틸리티 메서드 =====

  /**
   * 경로 결합 헬퍼 함수
   */
  private combinePaths(parent: string, child: string): string {
    if (!parent) return child.startsWith('/') ? child : `/${child}`;
    if (!child) return parent;

    const cleanParent = parent.endsWith('/') ? parent.slice(0, -1) : parent;
    const cleanChild = child.startsWith('/') ? child : `/${child}`;

    return `${cleanParent}${cleanChild}`;
  }

  /**
   * 경로를 정규화 (슬래시 제거 및 통일)
   */
  private normalizePath(path: string): string {
    if (!path) return '';
    return path.startsWith('/') ? path.slice(1) : path;
  }

  /**
   * 상단 메뉴 클릭 시 첫 번째 자식으로 네비게이션
   * 자식이 없으면 해당 라우트로 직접 이동
   */
  navigateToRouteOrFirstChild(routeName: string): void {
    const route = this.getRouteByName(routeName);
    if (!route) {
      console.warn(`라우트 "${routeName}"을 찾을 수 없습니다.`);
      return;
    }

    // 자식이 있으면 첫 번째 자식으로만 이동 (깊이 탐색 안함)
    if (route.children && route.children.length > 0) {
      const firstChild = route.children[0];
      this.plateStore.navigator.push(firstChild.fullPath);
    } else {
      // 자식이 없으면 해당 라우트로 직접 이동
      this.plateStore.navigator.push(route.fullPath);
    }
  }

  /**
   * 라우트 클릭 시 해당 라우트로 이동하거나 첫 번째 자식으로 이동
   * 자식이 있는 경우 첫 번째 자식으로, 없는 경우 해당 경로로 이동
   */
  navigateToRouteOrFirstChildByPath(fullPath: string): void {
    const targetRoute = this.findRouteByFullPath(fullPath);
    if (!targetRoute) {
      // 라우트를 찾을 수 없으면 해당 경로로 직접 이동
      this.plateStore.navigator.push(fullPath);
      return;
    }

    // 자식이 있으면 첫 번째 자식으로만 이동 (깊이 탐색 안함)
    if (targetRoute.children && targetRoute.children.length > 0) {
      const firstChild = targetRoute.children[0];
      this.plateStore.navigator.push(firstChild.fullPath);
    } else {
      // 자식이 없으면 해당 라우트로 직접 이동
      this.plateStore.navigator.push(targetRoute.fullPath);
    }
  }
}
