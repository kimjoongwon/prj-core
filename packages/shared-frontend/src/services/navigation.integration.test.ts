import {
  describe,
  it,
  expect,
  beforeEach,
  vi,
  afterEach,
  type MockedFunction,
} from 'vitest';
import { NavigationService } from './navigation';
import { NavigatorService } from './navigator';
import { type RouteBuilder } from '@shared/types';

// 외부 패키지 모킹
vi.mock('mobx', () => ({
  makeAutoObservable: () => {},
}));

// Node 환경에서 window 객체가 없으므로 간단히 생성
(global as any).window = {};

// Mock dependencies
vi.mock('./navigator');
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

describe('NavigationService - 통합 테스트', () => {
  let navigationService: NavigationService;
  let mockNavigator: {
    setNavigateFunction: MockedFunction<any>;
    push: MockedFunction<any>;
    goBack: MockedFunction<any>;
    goForward: MockedFunction<any>;
    go: MockedFunction<any>;
    replace: MockedFunction<any>;
  };
  let complexRoutes: RouteBuilder[];

  beforeEach(() => {
    mockNavigator = {
      setNavigateFunction: vi.fn(),
      push: vi.fn(),
      goBack: vi.fn(),
      goForward: vi.fn(),
      go: vi.fn(),
      replace: vi.fn(),
    };

    (NavigatorService as any).mockImplementation(() => mockNavigator);

    // 복잡한 라우트 구조로 실제 상황을 시뮬레이션
    complexRoutes = [
      {
        name: 'admin',
        pathname: '/admin',
        children: [
          {
            name: 'spaces',
            pathname: '/spaces',
            children: [
              {
                name: 'space-detail',
                pathname: '/:spaceId',
                children: [
                  {
                    name: 'grounds',
                    pathname: '/grounds',
                    children: [
                      {
                        name: 'ground-detail',
                        pathname: '/:groundId',
                        children: [
                          {
                            name: 'sessions',
                            pathname: '/sessions',
                            children: [
                              {
                                name: 'session-detail',
                                pathname: '/:sessionId',
                                children: [
                                  {
                                    name: 'participants',
                                    pathname: '/participants',
                                  },
                                  {
                                    name: 'timeline',
                                    pathname: '/timeline',
                                  },
                                ],
                              },
                            ],
                          },
                          {
                            name: 'programs',
                            pathname: '/programs',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    name: 'settings',
                    pathname: '/settings',
                  },
                ],
              },
            ],
          },
          {
            name: 'users',
            pathname: '/users',
            children: [
              {
                name: 'user-list',
                pathname: '/list',
              },
              {
                name: 'user-create',
                pathname: '/create',
              },
              {
                name: 'user-detail',
                pathname: '/:userId',
                children: [
                  {
                    name: 'user-profile',
                    pathname: '/profile',
                  },
                  {
                    name: 'user-permissions',
                    pathname: '/permissions',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        name: 'public',
        pathname: '/public',
        children: [
          {
            name: 'landing',
            pathname: '/landing',
          },
          {
            name: 'auth',
            pathname: '/auth',
            children: [
              {
                name: 'login',
                pathname: '/login',
              },
              {
                name: 'register',
                pathname: '/register',
              },
            ],
          },
        ],
      },
    ];

    navigationService = new NavigationService(complexRoutes);

    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: { pathname: '/admin/spaces/123/grounds/456' },
      writable: true,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('복잡한 라우트 구조 처리', () => {
    it('깊이 중첩된 라우트를 올바르게 플랫화해야 한다', () => {
      const flatRoutes = navigationService.debugFlatRoutes();

      // 최상위 라우트들
      expect(flatRoutes.has('admin')).toBe(true);
      expect(flatRoutes.has('public')).toBe(true);

      // 중간 레벨 라우트들
      expect(flatRoutes.has('spaces')).toBe(true);
      expect(flatRoutes.has('users')).toBe(true);
      expect(flatRoutes.has('auth')).toBe(true);

      // 깊이 중첩된 라우트들
      expect(flatRoutes.has('sessions')).toBe(true);
      expect(flatRoutes.has('participants')).toBe(true);
      expect(flatRoutes.has('timeline')).toBe(true);

      // 경로가 올바르게 결합되었는지 확인
      expect(flatRoutes.get('participants')?.pathname).toBe(
        '/admin/spaces/:spaceId/grounds/:groundId/sessions/:sessionId/participants',
      );
      expect(flatRoutes.get('user-profile')?.pathname).toBe(
        '/admin/users/:userId/profile',
      );
    });

    it('동적 매개변수가 포함된 경로를 올바르게 처리해야 한다', () => {
      const sessionDetailRoute =
        navigationService.getRouteByName('session-detail');
      expect(sessionDetailRoute?.pathname).toBe(
        '/admin/spaces/:spaceId/grounds/:groundId/sessions/:sessionId',
      );

      const userDetailRoute = navigationService.getRouteByName('user-detail');
      expect(userDetailRoute?.pathname).toBe('/admin/users/:userId');
    });
  });

  describe('실제 시나리오 테스트', () => {
    it('관리자가 특정 공간의 그라운드를 탐색하는 시나리오', () => {
      // 1. 공간 목록 페이지에서 시작
      navigationService.setCurrentPath('/admin/spaces');

      // 2. 특정 공간의 자식 라우트들 가져오기
      const spaceChildren =
        navigationService.getDirectChildrenByName('space-detail');
      expect(spaceChildren).toHaveLength(2);
      expect(spaceChildren.find(c => c.name === 'grounds')).toBeDefined();
      expect(spaceChildren.find(c => c.name === 'settings')).toBeDefined();

      // 3. 그라운드 페이지로 네비게이션
      navigationService.getNavigator().pushByName('grounds');
      expect(mockNavigator.push).toHaveBeenCalledWith(
        '/admin/spaces/:spaceId/grounds',
        undefined,
        undefined,
      );
    });

    it('사용자 관리 워크플로우 시나리오', () => {
      // 1. 사용자 목록에서 시작
      navigationService.setCurrentPath('/admin/users/list');

      // 2. 사용자 상세 페이지의 자식들 가져오기
      const userDetailChildren =
        navigationService.getDirectChildrenByName('user-detail');
      expect(userDetailChildren).toHaveLength(2);
      expect(
        userDetailChildren.find(c => c.name === 'user-profile'),
      ).toBeDefined();
      expect(
        userDetailChildren.find(c => c.name === 'user-permissions'),
      ).toBeDefined();

      // 3. 조건부 네비게이션 (권한에 따라)
      const hasPermissionToEditProfile = true;
      navigationService
        .getNavigator()
        .pushConditional(
          hasPermissionToEditProfile,
          'user-profile',
          'user-detail',
        );

      expect(mockNavigator.push).toHaveBeenCalledWith(
        '/admin/users/:userId/profile',
        undefined,
        undefined,
      );
    });

    it('인증 플로우 시나리오', () => {
      // 1. 공개 페이지에서 시작
      navigationService.setCurrentPath('/public/landing');

      // 2. 인증 관련 자식 라우트들 가져오기
      const authChildren = navigationService.getDirectChildrenByName('auth');
      expect(authChildren).toHaveLength(2);
      expect(authChildren.find(c => c.name === 'login')).toBeDefined();
      expect(authChildren.find(c => c.name === 'register')).toBeDefined();

      // 3. 로그인 페이지로 네비게이션
      navigationService.getNavigator().pushByName('login');
      expect(mockNavigator.push).toHaveBeenCalledWith(
        '/public/auth/login',
        undefined,
        undefined,
      );
    });
  });

  describe('성능 및 확장성 테스트', () => {
    it('대량의 라우트를 처리할 수 있어야 한다', () => {
      // 100개의 라우트를 가진 큰 구조 생성
      const largeRoutes: RouteBuilder[] = [];
      for (let i = 0; i < 100; i++) {
        largeRoutes.push({
          name: `route-${i}`,
          pathname: `/route-${i}`,
          children: Array.from({ length: 10 }, (_, j) => ({
            name: `route-${i}-child-${j}`,
            pathname: `/child-${j}`,
          })),
        });
      }

      const largeNavigationService = new NavigationService(largeRoutes);
      const flatRoutes = largeNavigationService.debugFlatRoutes();

      // 1100개의 라우트 (100개 부모 + 1000개 자식)
      expect(flatRoutes.size).toBe(1100);

      // 특정 라우트 검색이 빠르게 작동해야 함
      const startTime = performance.now();
      const route = largeNavigationService.getRouteByName('route-50-child-5');
      const endTime = performance.now();

      expect(route).toBeDefined();
      expect(route?.pathname).toBe('/route-50/child-5');
      expect(endTime - startTime).toBeLessThan(10); // 10ms 이내
    });

    it('메모리 효율적으로 라우트를 관리해야 한다', () => {
      const initialMemoryUsage = process.memoryUsage().heapUsed;

      // 여러 번 라우트 설정을 반복
      for (let i = 0; i < 100; i++) {
        navigationService.setRoutes(complexRoutes);
      }

      const finalMemoryUsage = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemoryUsage - initialMemoryUsage;

      // 메모리 증가가 합리적인 범위 내에 있어야 함 (10MB 이내)
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);
    });
  });

  describe('오류 복구 및 내구성', () => {
    it('잘못된 라우트 구조를 안전하게 처리해야 한다', () => {
      const malformedRoutes: RouteBuilder[] = [
        {
          name: 'valid-route',
          pathname: '/valid',
        },
        {
          // name이 없는 라우트
          pathname: '/no-name',
        } as RouteBuilder,
        {
          name: 'no-pathname',
          // pathname이 없는 라우트
        } as RouteBuilder,
        {
          name: 'empty-children',
          pathname: '/empty-children',
          children: [],
        },
      ];

      expect(() => {
        const faultyService = new NavigationService(malformedRoutes);
        faultyService.getRouteByName('valid-route');
        faultyService.getDirectChildrenByName('empty-children');
        faultyService.getSmartChildRoutes('/invalid-path');
      }).not.toThrow();
    });

    it('비동기 네비게이션 중 라우트 변경을 처리해야 한다', async () => {
      // 첫 번째 라우트 설정
      navigationService.setRoutes(complexRoutes);

      // 비동기 네비게이션 시뮬레이션
      const navigationPromise = new Promise(resolve => {
        setTimeout(() => {
          navigationService.getNavigator().pushByName('users');
          resolve(true);
        }, 10);
      });

      // 네비게이션 중 라우트 변경
      setTimeout(() => {
        navigationService.setRoutes([
          {
            name: 'new-route',
            pathname: '/new',
          },
        ]);
      }, 5);

      await navigationPromise;

      // 변경된 라우트가 반영되어야 함
      expect(navigationService.getRouteByName('new-route')).toBeDefined();
    });
  });

  describe('브라우저 호환성', () => {
    it('다양한 URL 형식을 처리해야 한다', () => {
      const urlFormats = [
        '/admin/spaces',
        '/admin/spaces/',
        'admin/spaces',
        '//admin//spaces//',
        '/admin/spaces?tab=overview',
        '/admin/spaces#section-1',
        '/admin/spaces?tab=overview#section-1',
      ];

      urlFormats.forEach(url => {
        expect(() => {
          navigationService.setCurrentPath(url);
          navigationService.getSmartChildRoutes(url);
        }).not.toThrow();
      });
    });

    it('특수 문자가 포함된 경로를 처리해야 한다', () => {
      const specialRoutes: RouteBuilder[] = [
        {
          name: 'special-chars',
          pathname: '/special-chars',
          children: [
            {
              name: 'with-spaces',
              pathname: '/with spaces',
            },
            {
              name: 'with-unicode',
              pathname: '/한글-경로',
            },
            {
              name: 'with-symbols',
              pathname: '/symbols@#$%',
            },
          ],
        },
      ];

      expect(() => {
        const specialService = new NavigationService(specialRoutes);
        specialService.getDirectChildrenByName('special-chars');
      }).not.toThrow();
    });
  });
});
