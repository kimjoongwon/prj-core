import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NavigatorStore, type INavigationStore } from '../navigatorStore';
import { PlateStore } from '../plateStore';

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

describe('NavigatorStore', () => {
  let navigatorStore: NavigatorStore;
  let plateStore: PlateStore;
  let mockNavigateFunction: ReturnType<typeof vi.fn>;
  let mockRouteResolver: ReturnType<typeof vi.fn>;
  let mockNavigationStore: INavigationStore;

  beforeEach(() => {
    // 실제 PlateStore를 생성하여 모든 스토어들이 제대로 연결되도록 함
    plateStore = new PlateStore([]);
    navigatorStore = plateStore.navigator;
    
    // navigation.activateRoute를 spy로 대체
    plateStore.navigation.activateRoute = vi.fn();
    
    mockNavigateFunction = vi.fn();
    mockRouteResolver = vi.fn();
    mockNavigationStore = {
      activateRoute: vi.fn(),
    };

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
      expect(navigatorStore.isNavigateFunctionSet()).toBe(false);
    });

    it('네비게이션 함수를 설정할 수 있어야 한다', () => {
      navigatorStore.setNavigateFunction(mockNavigateFunction);
      expect(navigatorStore.isNavigateFunctionSet()).toBe(true);
    });

    it('라우트 이름 리졸버를 설정할 수 있어야 한다', () => {
      navigatorStore.setRouteNameResolver(mockRouteResolver);
      // private 속성이므로 직접 테스트는 불가능하지만, pushByName에서 간접적으로 확인
    });

    it('PlateStore를 통해 네비게이션에 접근할 수 있어야 한다', () => {
      // PlateStore가 생성자에서 설정되므로, navigation이 제대로 설정되었는지 확인
      expect(plateStore.navigation).toBeDefined();
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

      navigatorStore.setNavigateFunction(reactRouterNavigate);
      // isReactRouter는 private이므로 replace 동작으로 간접 확인
    });

    it('Next.js router.push로 인식해야 한다', () => {
      // 일반 함수는 length가 1
      const nextRouterPush = vi.fn();

      navigatorStore.setNavigateFunction(nextRouterPush);
      // isReactRouter는 private이므로 replace 동작으로 간접 확인
    });
  });

  describe('경로 네비게이션 (push)', () => {
    beforeEach(() => {
      navigatorStore.setNavigateFunction(mockNavigateFunction);
      // navigatorStore.setNavigationStore(mockNavigationStore); // 더 이상 필요하지 않음
    });

    it('기본 경로로 네비게이션해야 한다', () => {
      navigatorStore.push('/dashboard');

      expect(mockNavigateFunction).toHaveBeenCalledWith('/dashboard');
      expect(plateStore.navigation.activateRoute).toHaveBeenCalledWith('/dashboard');
    });

    it('상대 경로를 절대 경로로 정규화해야 한다', () => {
      navigatorStore.push('dashboard');

      expect(mockNavigateFunction).toHaveBeenCalledWith('/dashboard');
      expect(plateStore.navigation.activateRoute).toHaveBeenCalledWith('/dashboard');
    });

    it('pathParams를 포함하여 네비게이션해야 한다', () => {
      navigatorStore.push('/users/:id', { id: 123 });

      expect(mockNavigateFunction).toHaveBeenCalledWith('/users/123');
    });

    it('searchParams를 포함하여 네비게이션해야 한다', () => {
      navigatorStore.push('/users', undefined, { page: '1', size: '10' });

      expect(mockNavigateFunction).toHaveBeenCalledWith(
        '/users?page=1&size=10',
      );
    });

    it('pathParams와 searchParams를 모두 포함하여 네비게이션해야 한다', () => {
      navigatorStore.push('/users/:id', { id: 123 }, { tab: 'details' });

      expect(mockNavigateFunction).toHaveBeenCalledWith(
        '/users/123?tab=details',
      );
    });

    it('네비게이션 함수가 설정되지 않았으면 경고를 출력해야 한다', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const unsetNavigator = new NavigatorStore(plateStore);

      unsetNavigator.push('/dashboard');

      expect(consoleSpy).toHaveBeenCalledWith(
        'NavigateFunction이 설정되지 않았습니다. setNavigateFunction을 먼저 호출하세요.',
      );

      consoleSpy.mockRestore();
    });
  });

  describe('라우트 이름으로 네비게이션 (pushByName)', () => {
    beforeEach(() => {
      navigatorStore.setNavigateFunction(mockNavigateFunction);
      navigatorStore.setRouteNameResolver(mockRouteResolver);
      // navigatorStore.setNavigationStore(mockNavigationStore); // 더 이상 필요하지 않음
    });

    it('라우트 이름으로 네비게이션해야 한다', () => {
      mockRouteResolver.mockReturnValue('/dashboard/users');

      navigatorStore.pushByName('사용자 목록');

      expect(mockRouteResolver).toHaveBeenCalledWith('사용자 목록');
      expect(mockNavigateFunction).toHaveBeenCalledWith('/dashboard/users');
      expect(plateStore.navigation.activateRoute).toHaveBeenCalledWith('/dashboard/users');
    });

    it('라우트 이름으로 pathParams와 함께 네비게이션해야 한다', () => {
      mockRouteResolver.mockReturnValue('/users/:id');

      navigatorStore.pushByName('사용자 상세', { id: 456 });

      expect(mockNavigateFunction).toHaveBeenCalledWith('/users/456');
    });

    it('라우트 이름으로 searchParams와 함께 네비게이션해야 한다', () => {
      mockRouteResolver.mockReturnValue('/users');

      navigatorStore.pushByName('사용자 목록', undefined, {
        filter: 'active',
      });

      expect(mockNavigateFunction).toHaveBeenCalledWith('/users?filter=active');
    });

    it('존재하지 않는 라우트 이름에 대해 경고를 출력해야 한다', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      mockRouteResolver.mockReturnValue(undefined);

      navigatorStore.pushByName('존재하지않는라우트');

      expect(consoleSpy).toHaveBeenCalledWith(
        '라우트 이름 "존재하지않는라우트"을 찾을 수 없습니다.',
      );
      expect(mockNavigateFunction).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('라우트 리졸버가 설정되지 않았으면 경고를 출력해야 한다', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const noResolverNavigator = new NavigatorStore(plateStore);
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
      navigatorStore.goBack();
      expect(window.history.back).toHaveBeenCalled();
    });

    it('앞으로가기를 실행해야 한다', () => {
      navigatorStore.goForward();
      expect(window.history.forward).toHaveBeenCalled();
    });

    it('특정 단계로 이동해야 한다', () => {
      navigatorStore.go(-2);
      expect(window.history.go).toHaveBeenCalledWith(-2);
    });

    it('window가 없는 환경에서도 에러가 발생하지 않아야 한다', () => {
      const originalWindow = global.window;
      delete (global as any).window;

      expect(() => {
        navigatorStore.goBack();
        navigatorStore.goForward();
        navigatorStore.go(-1);
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

      navigatorStore.setNavigateFunction(reactRouterNavigate);
      // navigatorStore.setNavigationStore(mockNavigationStore); // 더 이상 필요하지 않음

      navigatorStore.replace('/dashboard');

      expect(reactRouterNavigate).toHaveBeenCalledWith('/dashboard', {
        replace: true,
      });
      expect(plateStore.navigation.activateRoute).toHaveBeenCalledWith('/dashboard');
    });

    it('pathParams와 searchParams를 포함하여 replace해야 한다', () => {
      navigatorStore.setNavigateFunction(mockNavigateFunction);

      navigatorStore.replace('/users/:id', { id: 789 }, { edit: 'true' });

      expect(mockNavigateFunction).toHaveBeenCalledWith('/users/789?edit=true');
    });

    it('상대 경로를 절대 경로로 정규화해야 한다', () => {
      navigatorStore.setNavigateFunction(mockNavigateFunction);

      navigatorStore.replace('settings');

      expect(mockNavigateFunction).toHaveBeenCalledWith('/settings');
    });

    it('네비게이션 함수가 설정되지 않았으면 경고를 출력해야 한다', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const unsetNavigator = new NavigatorStore(plateStore);

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
      navigatorStore.setNavigateFunction(mockNavigateFunction);
      navigatorStore.push('/users/:id', { id: 123 }, { tab: 'profile' });

      // 결과만 확인 (PathUtil의 실제 호출은 mock에서 처리됨)
      expect(mockNavigateFunction).toHaveBeenCalledWith(
        '/users/123?tab=profile',
      );
    });
  });

  describe('엣지 케이스', () => {
    it('빈 경로로 네비게이션해야 한다', () => {
      navigatorStore.setNavigateFunction(mockNavigateFunction);

      navigatorStore.push('');

      expect(mockNavigateFunction).toHaveBeenCalledWith('/');
    });

    it('이미 절대 경로인 경우 그대로 사용해야 한다', () => {
      navigatorStore.setNavigateFunction(mockNavigateFunction);

      navigatorStore.push('/already/absolute');

      expect(mockNavigateFunction).toHaveBeenCalledWith('/already/absolute');
    });

    it('undefined pathParams와 searchParams를 처리해야 한다', () => {
      navigatorStore.setNavigateFunction(mockNavigateFunction);

      navigatorStore.push('/test', undefined, undefined);

      expect(mockNavigateFunction).toHaveBeenCalledWith('/test');
    });
  });

  describe.skip('의존성 주입 (Dependency Injection) - 이 기능들은 새로운 PlateStore 아키텍처에서 더 이상 사용되지 않음', () => {
    it('INavigationStore를 통한 의존성 주입이 올바르게 동작해야 한다', () => {
      const customNavigationStore: INavigationStore = {
        activateRoute: vi.fn(),
      };

      navigatorStore.setNavigateFunction(mockNavigateFunction);
      // navigatorStore.setNavigationStore(customNavigationStore); // 더 이상 필요하지 않음

      navigatorStore.push('/test-path');

      expect(mockNavigateFunction).toHaveBeenCalledWith('/test-path');
      expect(customNavigationStore.activateRoute).toHaveBeenCalledWith('/test-path');
    });

    it('하위 호환성: setActivateRouteCallback도 여전히 동작해야 한다', () => {
      const legacyCallback = vi.fn();
      
      navigatorStore.setNavigateFunction(mockNavigateFunction);
      // navigatorStore.setActivateRouteCallback(legacyCallback); // 더 이상 필요하지 않음

      navigatorStore.push('/legacy-path');

      expect(mockNavigateFunction).toHaveBeenCalledWith('/legacy-path');
      expect(legacyCallback).toHaveBeenCalledWith('/legacy-path');
    });

    it('NavigationStore가 설정되지 않았을 때도 네비게이션은 정상 동작해야 한다', () => {
      navigatorStore.setNavigateFunction(mockNavigateFunction);
      // NavigationStore 설정하지 않음

      navigatorStore.push('/no-service-path');

      expect(mockNavigateFunction).toHaveBeenCalledWith('/no-service-path');
      // activateRoute는 호출되지 않아야 함
    });

    it('replace 메서드에서도 의존성 주입이 올바르게 동작해야 한다', () => {
      const testNavigationStore: INavigationStore = {
        activateRoute: vi.fn(),
      };

      const reactRouterNavigate = vi.fn();
      Object.defineProperty(reactRouterNavigate, 'length', {
        value: 2,
        configurable: true,
      });

      navigatorStore.setNavigateFunction(reactRouterNavigate);
      // navigatorStore.setNavigationStore(testNavigationStore); // 더 이상 필요하지 않음

      navigatorStore.replace('/replace-path');

      expect(reactRouterNavigate).toHaveBeenCalledWith('/replace-path', { replace: true });
      expect(plateStore.navigation.activateRoute).toHaveBeenCalledWith('/replace-path');
    });

    it('pushByName에서도 의존성 주입이 올바르게 동작해야 한다', () => {
      const testNavigationStore: INavigationStore = {
        activateRoute: vi.fn(),
      };

      navigatorStore.setNavigateFunction(mockNavigateFunction);
      navigatorStore.setRouteNameResolver(mockRouteResolver);
      // navigatorStore.setNavigationStore(testNavigationStore); // 더 이상 필요하지 않음

      mockRouteResolver.mockReturnValue('/resolved-path');

      navigatorStore.pushByName('test-route');

      expect(mockNavigateFunction).toHaveBeenCalledWith('/resolved-path');
      expect(plateStore.navigation.activateRoute).toHaveBeenCalledWith('/resolved-path');
    });
  });
});
