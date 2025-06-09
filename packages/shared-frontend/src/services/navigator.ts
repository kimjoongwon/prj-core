import { PathUtil } from '@shared/utils';
import { type NavigateFunction } from 'react-router';

// Next.js와 React Router 모두 지원하기 위한 타입
type UniversalNavigateFunction = NavigateFunction | ((path: string) => void);

/**
 * NavigatorService - 네비게이션 전용 서비스
 * 실제 네비게이션 함수 관리와 실행을 담당
 */
export class NavigatorService {
  private navigateFunction?: UniversalNavigateFunction;

  /**
   * React Router의 navigate 함수 또는 Next.js router.push 설정
   */
  setNavigateFunction(navigateFunction: UniversalNavigateFunction): void {
    this.navigateFunction = navigateFunction;
  }

  /**
   * 네비게이션 함수가 설정되어 있는지 확인
   */
  isNavigateFunctionSet(): boolean {
    return !!this.navigateFunction;
  }

  /**
   * 경로 네비게이션
   */
  push(
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

    this.navigateFunction(pathnameWithSearchParams);
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
      // React Router 스타일 확인 - NavigateFunction 타입인지 확인
      if ('length' in this.navigateFunction) {
        // NavigateFunction의 경우 매개변수가 있으므로 length 속성이 있음
        (this.navigateFunction as NavigateFunction)(pathnameWithSearchParams, {
          replace: true,
        });
      } else {
        // Next.js 스타일
        (this.navigateFunction as (path: string) => void)(
          pathnameWithSearchParams,
        );
      }
    }
  }
}
