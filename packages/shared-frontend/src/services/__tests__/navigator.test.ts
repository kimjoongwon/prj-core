import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NavigatorService } from '../navigator';

// PathUtil mock
vi.mock('@shared/utils', () => ({
  PathUtil: {
    getUrlWithParamsAndQueryString: vi.fn(
      (pathname, pathParams, searchParams) => {
        let result = pathname;

        // pathParams 처리 (간단한 구현)
        if (pathParams) {
          Object.entries(pathParams).forEach(([key, value]) => {
            result = result.replace(`:${key}`, String(value));
          });
        }

        // searchParams 처리
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
  let mockNavigateFunction: ReturnType<typeof vi.fn>;
  let mockRouteResolver: ReturnType<typeof vi.fn>;
  let mockActivateCallback: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    navigatorService = new NavigatorService();
    mockNavigateFunction = vi.fn();
    mockRouteResolver = vi.fn();
    mockActivateCallback = vi.fn();

    // window 객체 mock
    Object.defineProperty(window, 'history', {
      value: {
        back: vi.fn(),
        forward: vi.fn(),
        go: vi.fn(),
      },
      writable: true,
    });
  });

  describe('초기화 및 설정', () => {
    it('초기 상태에서는 네비게이션 함수가 설정되지 않아야 한다', () => {
      expect(navigatorService.isNavigateFunctionSet()).toBe(false);
    });

    it('네비게이션 함수를 설정할 수 있어야 한다', () => {
      navigatorService.setNavigateFunction(mockNavigateFunction);
      expect(navigatorService.isNavigateFunctionSet()).toBe(true);
    });

    it('라우트 이름 리졸버를 설정할 수 있어야 한다', () => {
      navigatorService.setRouteNameResolver(mockRouteResolver);
      // private 속성이므로 직접 테스트는 불가능하지만, pushByName에서 간접적으로 확인
    });

    it('활성화 콜백을 설정할 수 있어야 한다', () => {
      navigatorService.setActivateRouteCallback(mockActivateCallback);
      // private 속성이므로 직접 테스트는 불가능하지만, push에서 간접적으로 확인
    });
  });
  describe('React Router vs Next.js 구분', () => {
    it('React Router NavigateFunction으로 인식해야 한다', () => {
      // React Router NavigateFunction은 length가 2 이상
      const reactRouterNavigate = vi.fn();
      // length 속성을 Object.defineProperty로 설정
      Object.defineProperty(reactRouterNavigate, 'length', {
        value: 2,
        configurable: true,
      });

      navigatorService.setNavigateFunction(reactRouterNavigate);
      // isReactRouter는 private이므로 replace 동작으로 간접 확인
    });

    it('Next.js router.push로 인식해야 한다', () => {
      // 일반 함수는 length가 1
      const nextRouterPush = vi.fn();

      navigatorService.setNavigateFunction(nextRouterPush);
      // isReactRouter는 private이므로 replace 동작으로 간접 확인
    });
  });

  describe('경로 네비게이션 (push)', () => {
    beforeEach(() => {
      navigatorService.setNavigateFunction(mockNavigateFunction);
      navigatorService.setActivateRouteCallback(mockActivateCallback);
    });

    it('기본 경로로 네비게이션해야 한다', () => {
      navigatorService.push('/dashboard');

      expect(mockNavigateFunction).toHaveBeenCalledWith('/dashboard');
      expect(mockActivateCallback).toHaveBeenCalledWith('/dashboard');
    });

    it('상대 경로를 절대 경로로 정규화해야 한다', () => {
      navigatorService.push('dashboard');

      expect(mockNavigateFunction).toHaveBeenCalledWith('/dashboard');
      expect(mockActivateCallback).toHaveBeenCalledWith('/dashboard');
    });

    it('pathParams를 포함하여 네비게이션해야 한다', () => {
      navigatorService.push('/users/:id', { id: 123 });

      expect(mockNavigateFunction).toHaveBeenCalledWith('/users/123');
    });

    it('searchParams를 포함하여 네비게이션해야 한다', () => {
      navigatorService.push('/users', undefined, { page: '1', size: '10' });

      expect(mockNavigateFunction).toHaveBeenCalledWith(
        '/users?page=1&size=10',
      );
    });

    it('pathParams와 searchParams를 모두 포함하여 네비게이션해야 한다', () => {
      navigatorService.push('/users/:id', { id: 123 }, { tab: 'details' });

      expect(mockNavigateFunction).toHaveBeenCalledWith(
        '/users/123?tab=details',
      );
    });

    it('네비게이션 함수가 설정되지 않았으면 경고를 출력해야 한다', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const unsetNavigator = new NavigatorService();

      unsetNavigator.push('/dashboard');

      expect(consoleSpy).toHaveBeenCalledWith(
        'NavigateFunction이 설정되지 않았습니다. setNavigateFunction을 먼저 호출하세요.',
      );

      consoleSpy.mockRestore();
    });
  });

  describe('라우트 이름으로 네비게이션 (pushByName)', () => {
    beforeEach(() => {
      navigatorService.setNavigateFunction(mockNavigateFunction);
      navigatorService.setRouteNameResolver(mockRouteResolver);
      navigatorService.setActivateRouteCallback(mockActivateCallback);
    });

    it('라우트 이름으로 네비게이션해야 한다', () => {
      mockRouteResolver.mockReturnValue('/dashboard/users');

      navigatorService.pushByName('사용자 목록');

      expect(mockRouteResolver).toHaveBeenCalledWith('사용자 목록');
      expect(mockNavigateFunction).toHaveBeenCalledWith('/dashboard/users');
      expect(mockActivateCallback).toHaveBeenCalledWith('/dashboard/users');
    });

    it('라우트 이름으로 pathParams와 함께 네비게이션해야 한다', () => {
      mockRouteResolver.mockReturnValue('/users/:id');

      navigatorService.pushByName('사용자 상세', { id: 456 });

      expect(mockNavigateFunction).toHaveBeenCalledWith('/users/456');
    });

    it('라우트 이름으로 searchParams와 함께 네비게이션해야 한다', () => {
      mockRouteResolver.mockReturnValue('/users');

      navigatorService.pushByName('사용자 목록', undefined, {
        filter: 'active',
      });

      expect(mockNavigateFunction).toHaveBeenCalledWith('/users?filter=active');
    });

    it('존재하지 않는 라우트 이름에 대해 경고를 출력해야 한다', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      mockRouteResolver.mockReturnValue(undefined);

      navigatorService.pushByName('존재하지않는라우트');

      expect(consoleSpy).toHaveBeenCalledWith(
        '라우트 이름 "존재하지않는라우트"을 찾을 수 없습니다.',
      );
      expect(mockNavigateFunction).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('라우트 리졸버가 설정되지 않았으면 경고를 출력해야 한다', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const noResolverNavigator = new NavigatorService();
      noResolverNavigator.setNavigateFunction(mockNavigateFunction);

      noResolverNavigator.pushByName('테스트라우트');

      expect(consoleSpy).toHaveBeenCalledWith(
        'Route name resolver가 설정되지 않았습니다. setRouteNameResolver를 먼저 호출하세요.',
      );

      consoleSpy.mockRestore();
    });
  });

  describe('히스토리 네비게이션', () => {
    it('뒤로가기를 실행해야 한다', () => {
      navigatorService.goBack();
      expect(window.history.back).toHaveBeenCalled();
    });

    it('앞으로가기를 실행해야 한다', () => {
      navigatorService.goForward();
      expect(window.history.forward).toHaveBeenCalled();
    });

    it('특정 단계로 이동해야 한다', () => {
      navigatorService.go(-2);
      expect(window.history.go).toHaveBeenCalledWith(-2);
    });

    it('window가 없는 환경에서도 에러가 발생하지 않아야 한다', () => {
      const originalWindow = global.window;
      delete (global as any).window;

      expect(() => {
        navigatorService.goBack();
        navigatorService.goForward();
        navigatorService.go(-1);
      }).not.toThrow();

      global.window = originalWindow;
    });
  });

  describe('URL 대체 (replace)', () => {
    it('React Router에서 replace 옵션과 함께 호출해야 한다', () => {
      // React Router NavigateFunction mock
      const reactRouterNavigate = vi.fn();
      // length 속성을 Object.defineProperty로 설정
      Object.defineProperty(reactRouterNavigate, 'length', {
        value: 2,
        configurable: true,
      });

      navigatorService.setNavigateFunction(reactRouterNavigate);
      navigatorService.setActivateRouteCallback(mockActivateCallback);

      navigatorService.replace('/dashboard');

      expect(reactRouterNavigate).toHaveBeenCalledWith('/dashboard', {
        replace: true,
      });
      expect(mockActivateCallback).toHaveBeenCalledWith('/dashboard');
    });

    it('pathParams와 searchParams를 포함하여 replace해야 한다', () => {
      navigatorService.setNavigateFunction(mockNavigateFunction);

      navigatorService.replace('/users/:id', { id: 789 }, { edit: 'true' });

      expect(mockNavigateFunction).toHaveBeenCalledWith('/users/789?edit=true');
    });

    it('상대 경로를 절대 경로로 정규화해야 한다', () => {
      navigatorService.setNavigateFunction(mockNavigateFunction);

      navigatorService.replace('settings');

      expect(mockNavigateFunction).toHaveBeenCalledWith('/settings');
    });

    it('네비게이션 함수가 설정되지 않았으면 경고를 출력해야 한다', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const unsetNavigator = new NavigatorService();

      unsetNavigator.replace('/dashboard');

      expect(consoleSpy).toHaveBeenCalledWith(
        'NavigateFunction이 설정되지 않았습니다. setNavigateFunction을 먼저 호출하세요.',
      );

      consoleSpy.mockRestore();
    });
  });

  describe('PathUtil 통합', () => {
    it('PathUtil.getUrlWithParamsAndQueryString을 올바르게 호출해야 한다', () => {
      // PathUtil이 mock되어 있으므로 함수 호출 확인
      navigatorService.setNavigateFunction(mockNavigateFunction);
      navigatorService.push('/users/:id', { id: 123 }, { tab: 'profile' });

      // 결과만 확인 (PathUtil의 실제 호출은 mock에서 처리됨)
      expect(mockNavigateFunction).toHaveBeenCalledWith(
        '/users/123?tab=profile',
      );
    });
  });

  describe('엣지 케이스', () => {
    it('빈 경로로 네비게이션해야 한다', () => {
      navigatorService.setNavigateFunction(mockNavigateFunction);

      navigatorService.push('');

      expect(mockNavigateFunction).toHaveBeenCalledWith('/');
    });

    it('이미 절대 경로인 경우 그대로 사용해야 한다', () => {
      navigatorService.setNavigateFunction(mockNavigateFunction);

      navigatorService.push('/already/absolute');

      expect(mockNavigateFunction).toHaveBeenCalledWith('/already/absolute');
    });

    it('undefined pathParams와 searchParams를 처리해야 한다', () => {
      navigatorService.setNavigateFunction(mockNavigateFunction);

      navigatorService.push('/test', undefined, undefined);

      expect(mockNavigateFunction).toHaveBeenCalledWith('/test');
    });
  });
});
