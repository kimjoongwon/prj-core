import { PathUtil } from '@shared/utils';
import { type NavigateFunction } from 'react-router';
import { type PlateStore } from './plateStore';

// Next.js와 React Router 모두 지원하기 위한 타입
type UniversalNavigateFunction = NavigateFunction | ((path: string) => void);

/**
 * 네비게이션 스토어 인터페이스
 */
export interface INavigationStore {
  activateRoute(pathname: string): void;
}

/**
 * NavigatorStore - 네비게이션 전용 스토어
 * 실제 네비게이션 함수 관리와 실행을 담당
 */
export class NavigatorStore {
  private navigateFunction?: UniversalNavigateFunction;
  private isReactRouter: boolean = false;
  private pathResolver?: (name: string) => string | undefined;
  private plateStore: PlateStore;

  constructor(plateStore: PlateStore) {
    this.plateStore = plateStore;
  }

  /**
   * React Router의 navigate 함수 또는 Next.js router.push 설정
   */
  setNavigateFunction(navigateFunction: UniversalNavigateFunction): void {
    this.navigateFunction = navigateFunction;
    // NavigateFunction인지 확인 (length가 2 이상이면 React Router로 간주)
    this.isReactRouter =
      typeof navigateFunction === 'function' && navigateFunction.length >= 2;
  }

  /**
   * 네비게이션 함수가 설정되어 있는지 확인
   */
  isNavigateFunctionSet(): boolean {
    return !!this.navigateFunction;
  }

  /**
   * 라우트 이름 -> 경로 변환 함수를 설정
   */
  setRouteNameResolver(resolver: (name: string) => string | undefined): void {
    this.pathResolver = resolver;
  }

  /**
   * 경로 네비게이션
   */
  push(
    pathname: string,
    pathParams?: object,
    searchParams?: Record<string, string>,
  ): void {
    if (!this?.navigateFunction) {
      console.warn(
        'NavigateFunction이 설정되지 않았습니다. setNavigateFunction을 먼저 호출하세요.',
      );
      return;
    }

    // 절대 경로로 정규화 - React Router가 상대 경로로 해석하지 않도록 함
    const normalizedPathname = pathname.startsWith('/')
      ? pathname
      : `/${pathname}`;

    let urlSearchParams;
    if (searchParams) {
      urlSearchParams = new URLSearchParams(searchParams).toString();
    }

    const pathnameWithSearchParams = PathUtil.getUrlWithParamsAndQueryString(
      normalizedPathname,
      pathParams,
      urlSearchParams,
    );

    this.navigateFunction(pathnameWithSearchParams);

    // 네비게이션 후 라우트 활성화 상태 업데이트
    if (this.plateStore?.navigation) {
      this.plateStore.navigation.activateRoute(normalizedPathname);
    }
  }

  /**
   * 라우트 이름으로 네비게이션
   */
  pushByName(
    routeName: string,
    pathParams?: object,
    searchParams?: Record<string, string>,
  ): void {
    if (!this.pathResolver) {
      console.warn(
        'Route name resolver가 설정되지 않았습니다. setRouteNameResolver를 먼저 호출하세요.',
      );
      return;
    }

    const pathname = this.pathResolver(routeName);
    if (!pathname) {
      console.warn(`라우트 이름 "${routeName}"을 찾을 수 없습니다.`);
      return;
    }

    this.push(pathname, pathParams, searchParams);
  }

  /**
   * 뒤로가기 (history.back() 기능)
   */
  goBack(): void {
    if (typeof window !== 'undefined') {
      window.history.back();
    }
  }

  /**
   * 앞으로가기 (history.forward() 기능)
   */
  goForward(): void {
    if (typeof window !== 'undefined') {
      window.history.forward();
    }
  }

  /**
   * 특정 단계만큼 뒤로가기 (history.go() 기능)
   */
  go(delta: number): void {
    if (typeof window !== 'undefined') {
      window.history.go(delta);
    }
  }

  /**
   * 현재 URL 대체 (replace 기능)
   */
  replace(
    pathname: string,
    pathParams?: object,
    searchParams?: Record<string, string>,
  ): void {
    if (!this.navigateFunction) {
      console.warn(
        'NavigateFunction이 설정되지 않았습니다. setNavigateFunction을 먼저 호출하세요.',
      );
      return;
    }

    // 절대 경로로 정규화 - React Router가 상대 경로로 해석하지 않도록 함
    const normalizedPathname = pathname.startsWith('/')
      ? pathname
      : `/${pathname}`;

    let urlSearchParams;
    if (searchParams) {
      urlSearchParams = new URLSearchParams(searchParams).toString();
    }

    const pathnameWithSearchParams = PathUtil.getUrlWithParamsAndQueryString(
      normalizedPathname,
      pathParams,
      urlSearchParams,
    );

    // React Router의 경우 navigate(path, { replace: true })
    // Next.js의 경우 router.replace(path)
    if (this.navigateFunction) {
      if (this.isReactRouter) {
        // React Router NavigateFunction
        (this.navigateFunction as NavigateFunction)(pathnameWithSearchParams, {
          replace: true,
        });
      } else {
        // Next.js 스타일 - replace 옵션 없이 호출
        (this.navigateFunction as (path: string) => void)(
          pathnameWithSearchParams,
        );
      }

      // 네비게이션 후 라우트 활성화 상태 업데이트
      if (this.plateStore?.navigation) {
        this.plateStore.navigation.activateRoute(normalizedPathname);
      }
    }
  }
}
