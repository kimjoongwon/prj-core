import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { NavigatorService } from './navigator';
import { type NavigateFunction } from 'react-router';

// PathUtil 모킹
vi.mock('@shared/utils', () => ({
  PathUtil: {
    getUrlWithParamsAndQueryString: vi.fn(
      (pathname, pathParams, searchParams) => {
        let result = pathname;
        if (pathParams && typeof pathParams === 'object') {
          Object.entries(pathParams).forEach(([key, value]) => {
            result = result.replace(`:${key}`, String(value));
          });
        }
        if (searchParams) {
          result += `?${searchParams}`;
        }
        return result;
      },
    ),
  },
}));

describe('NavigatorService', () => {
  let navigatorService: NavigatorService;
  let mockNavigateFunction: vi.MockedFunction<NavigateFunction>;
  let mockNextJsNavigate: vi.MockedFunction<(path: string) => void>;

  beforeEach(() => {
    navigatorService = new NavigatorService();
    mockNavigateFunction = vi.fn();
    mockNextJsNavigate = vi.fn();

    // window.history 모킹
    Object.defineProperty(window, 'history', {
      value: {
        back: vi.fn(),
        forward: vi.fn(),
        go: vi.fn(),
      },
      writable: true,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('네비게이션 함수 설정', () => {
    it('React Router navigate 함수를 설정할 수 있어야 한다', () => {
      navigatorService.setNavigateFunction(mockNavigateFunction);
      expect(navigatorService.isNavigateFunctionSet()).toBe(true);
    });

    it('Next.js router.push 함수를 설정할 수 있어야 한다', () => {
      navigatorService.setNavigateFunction(mockNextJsNavigate);
      expect(navigatorService.isNavigateFunctionSet()).toBe(true);
    });

    it('초기 상태에서는 네비게이션 함수가 설정되지 않아야 한다', () => {
      expect(navigatorService.isNavigateFunctionSet()).toBe(false);
    });
  });

  describe('push 네비게이션', () => {
    beforeEach(() => {
      navigatorService.setNavigateFunction(mockNavigateFunction);
    });

    it('기본 경로로 네비게이션할 수 있어야 한다', () => {
      navigatorService.push('/admin/dashboard');

      expect(mockNavigateFunction).toHaveBeenCalledWith('/admin/dashboard');
    });

    it('상대 경로를 절대 경로로 변환해야 한다', () => {
      navigatorService.push('admin/dashboard');

      expect(mockNavigateFunction).toHaveBeenCalledWith('/admin/dashboard');
    });

    it('경로 매개변수와 함께 네비게이션할 수 있어야 한다', () => {
      navigatorService.push('/admin/users/:id', { id: '123' });

      expect(mockNavigateFunction).toHaveBeenCalledWith('/admin/users/123');
    });

    it('쿼리 매개변수와 함께 네비게이션할 수 있어야 한다', () => {
      navigatorService.push('/admin/users', undefined, {
        page: '1',
        size: '10',
      });

      expect(mockNavigateFunction).toHaveBeenCalledWith(
        '/admin/users?page=1&size=10',
      );
    });

    it('경로 매개변수와 쿼리 매개변수를 모두 사용할 수 있어야 한다', () => {
      navigatorService.push(
        '/admin/users/:id/profile',
        { id: '123' },
        { tab: 'settings', section: 'privacy' },
      );

      expect(mockNavigateFunction).toHaveBeenCalledWith(
        '/admin/users/123/profile?tab=settings&section=privacy',
      );
    });

    it('네비게이션 함수가 설정되지 않은 경우 경고를 표시해야 한다', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const serviceWithoutNavigate = new NavigatorService();

      serviceWithoutNavigate.push('/admin/dashboard');

      expect(consoleSpy).toHaveBeenCalledWith(
        'NavigateFunction이 설정되지 않았습니다. setNavigateFunction을 먼저 호출하세요.',
      );
      expect(mockNavigateFunction).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('replace 네비게이션', () => {
    it('React Router 스타일 replace를 사용해야 한다', () => {
      // NavigateFunction 특성을 가진 함수로 모킹 (length 속성 추가)
      const mockReactRouterNavigate = vi.fn() as NavigateFunction;
      Object.defineProperty(mockReactRouterNavigate, 'length', { value: 2 });

      navigatorService.setNavigateFunction(mockReactRouterNavigate);
      navigatorService.replace('/admin/dashboard');

      expect(mockReactRouterNavigate).toHaveBeenCalledWith('/admin/dashboard', {
        replace: true,
      });
    });

    it('Next.js 스타일 replace를 사용해야 한다', () => {
      // Next.js 함수는 length가 1인 단순 함수로 모킹
      const mockNextJsNavigate = vi.fn() as (path: string) => void;
      Object.defineProperty(mockNextJsNavigate, 'length', { value: 1 });

      navigatorService.setNavigateFunction(mockNextJsNavigate);
      navigatorService.replace('/admin/dashboard');

      expect(mockNextJsNavigate).toHaveBeenCalledWith('/admin/dashboard');
    });

    it('경로 매개변수와 쿼리 매개변수를 처리해야 한다', () => {
      const mockReactRouterNavigate = vi.fn() as NavigateFunction;
      Object.defineProperty(mockReactRouterNavigate, 'length', { value: 2 });

      navigatorService.setNavigateFunction(mockReactRouterNavigate);
      navigatorService.replace(
        '/admin/users/:id',
        { id: '456' },
        { view: 'edit' },
      );

      expect(mockReactRouterNavigate).toHaveBeenCalledWith(
        '/admin/users/456?view=edit',
        { replace: true },
      );
    });

    it('네비게이션 함수가 설정되지 않은 경우 경고를 표시해야 한다', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const serviceWithoutNavigate = new NavigatorService();

      serviceWithoutNavigate.replace('/admin/dashboard');

      expect(consoleSpy).toHaveBeenCalledWith(
        'NavigateFunction이 설정되지 않았습니다. setNavigateFunction을 먼저 호출하세요.',
      );

      consoleSpy.mockRestore();
    });
  });

  describe('히스토리 네비게이션', () => {
    it('뒤로가기를 실행할 수 있어야 한다', () => {
      navigatorService.goBack();
      expect(window.history.back).toHaveBeenCalled();
    });

    it('앞으로가기를 실행할 수 있어야 한다', () => {
      navigatorService.goForward();
      expect(window.history.forward).toHaveBeenCalled();
    });

    it('특정 단계로 이동할 수 있어야 한다', () => {
      navigatorService.go(-2);
      expect(window.history.go).toHaveBeenCalledWith(-2);

      navigatorService.go(1);
      expect(window.history.go).toHaveBeenCalledWith(1);
    });
  });

  describe('엣지 케이스', () => {
    it('빈 경로를 처리해야 한다', () => {
      navigatorService.setNavigateFunction(mockNavigateFunction);
      navigatorService.push('');

      expect(mockNavigateFunction).toHaveBeenCalledWith('/');
    });

    it('null/undefined 매개변수를 안전하게 처리해야 한다', () => {
      navigatorService.setNavigateFunction(mockNavigateFunction);

      expect(() => {
        navigatorService.push('/admin', undefined, undefined);
        navigatorService.replace('/admin', null as any, undefined);
      }).not.toThrow();
    });

    it('window 객체가 없는 환경에서도 안전해야 한다', () => {
      // window 객체 임시 제거
      const originalWindow = global.window;
      delete (global as any).window;

      expect(() => {
        navigatorService.goBack();
        navigatorService.goForward();
        navigatorService.go(-1);
      }).not.toThrow();

      // window 객체 복원
      global.window = originalWindow;
    });

    it('복잡한 중첩 경로를 처리해야 한다', () => {
      navigatorService.setNavigateFunction(mockNavigateFunction);
      navigatorService.push(
        '/admin/spaces/:spaceId/grounds/:groundId/sessions/:sessionId',
        { spaceId: '123', groundId: '456', sessionId: '789' },
        { view: 'details', tab: 'participants' },
      );

      expect(mockNavigateFunction).toHaveBeenCalledWith(
        '/admin/spaces/123/grounds/456/sessions/789?view=details&tab=participants',
      );
    });
  });
});
