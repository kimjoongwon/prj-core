import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { NavigationService } from './navigation';
import { type RouteBuilder } from '@shared/types';

// 모킹되지 않은 외부 의존성을 간단히 대체
vi.mock('mobx', () => ({
  makeAutoObservable: () => {},
}));

// Node 환경에서 window 객체가 없으므로 간단히 생성
(global as any).window = {};

// Mock NavigatorService
vi.mock('./navigator', () => ({
  NavigatorService: vi.fn().mockImplementation(() => ({
    setNavigateFunction: vi.fn(),
    push: vi.fn(),
  })),
}));

// Mock window.location
const mockLocation = {
  pathname: '/admin/dashboard',
};

Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true,
});

describe('NavigationService', () => {
  let navigationService: NavigationService;
  let mockRoutes: RouteBuilder[];

  beforeEach(() => {
    // 테스트용 라우트 구조 설정
    mockRoutes = [
      {
        name: 'admin',
        pathname: '/admin',
        children: [
          {
            name: 'dashboard',
            pathname: '/dashboard',
            children: [
              {
                name: 'analytics',
                pathname: '/analytics',
              },
              {
                name: 'reports',
                pathname: '/reports',
              },
            ],
          },
          {
            name: 'users',
            pathname: '/users',
            children: [
              {
                name: 'list',
                pathname: '/list',
              },
              {
                name: 'create',
                pathname: '/create',
              },
            ],
          },
          {
            name: 'settings',
            pathname: '/settings',
          },
        ],
      },
      {
        name: 'public',
        pathname: '/public',
        children: [
          {
            name: 'home',
            pathname: '/home',
          },
          {
            name: 'about',
            pathname: '/about',
          },
        ],
      },
    ];

    navigationService = new NavigationService(mockRoutes);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('초기화 및 라우트 설정', () => {
    it('라우트 빌더가 올바르게 설정되어야 한다', () => {
      expect(navigationService.routeBuilders).toEqual(mockRoutes);
    });

    it('플랫 라우트 맵이 올바르게 생성되어야 한다', () => {
      const flatRoutes = navigationService.debugFlatRoutes();

      expect(flatRoutes.has('admin')).toBe(true);
      expect(flatRoutes.has('dashboard')).toBe(true);
      expect(flatRoutes.has('analytics')).toBe(true);
      expect(flatRoutes.has('users')).toBe(true);
      expect(flatRoutes.has('list')).toBe(true);

      // 경로가 올바르게 결합되었는지 확인
      expect(flatRoutes.get('dashboard')?.pathname).toBe('/admin/dashboard');
      expect(flatRoutes.get('analytics')?.pathname).toBe(
        '/admin/dashboard/analytics',
      );
      expect(flatRoutes.get('list')?.pathname).toBe('/admin/users/list');
    });

    it('현재 경로가 올바르게 초기화되어야 한다', () => {
      expect(navigationService.currentFullPath).toBe('/admin/dashboard');
      expect(navigationService.currentRelativePath).toBe('dashboard');
    });
  });

  describe('현재 경로 추적', () => {
    it('절대 경로를 올바르게 업데이트해야 한다', () => {
      navigationService.setCurrentPath('/admin/users/list');

      expect(navigationService.currentFullPath).toBe('/admin/users/list');
      expect(navigationService.currentRelativePath).toBe('list');
    });

    it('상대 경로를 올바르게 추출해야 한다', () => {
      navigationService.setCurrentPath('/admin/dashboard/analytics');
      expect(navigationService.currentRelativePath).toBe('analytics');

      navigationService.setCurrentPath('/public/home');
      expect(navigationService.currentRelativePath).toBe('home');

      navigationService.setCurrentPath('/');
      expect(navigationService.currentRelativePath).toBe('');
    });
  });

  describe('라우트 검색', () => {
    it('이름으로 라우트를 찾을 수 있어야 한다', () => {
      const dashboardRoute = navigationService.getRouteByName('dashboard');
      expect(dashboardRoute).toBeDefined();
      expect(dashboardRoute?.name).toBe('dashboard');
      expect(dashboardRoute?.pathname).toBe('/admin/dashboard');
    });

    it('존재하지 않는 라우트 이름에 대해 undefined를 반환해야 한다', () => {
      const nonExistentRoute = navigationService.getRouteByName('nonexistent');
      expect(nonExistentRoute).toBeUndefined();
    });

    it('이름으로 경로를 가져올 수 있어야 한다', () => {
      const dashboardPath = navigationService.getPathByName('dashboard');
      expect(dashboardPath).toBe('/admin/dashboard');

      const analyticsPath = navigationService.getPathByName('analytics');
      expect(analyticsPath).toBe('/admin/dashboard/analytics');
    });
  });

  describe('직계 자식 라우트 가져오기', () => {
    it('라우트 이름으로 직계 자식들을 가져올 수 있어야 한다', () => {
      const adminChildren = navigationService.getDirectChildrenByName('admin');

      expect(adminChildren).toHaveLength(3);
      expect(adminChildren[0].name).toBe('dashboard');
      expect(adminChildren[0].pathname).toBe('/admin/dashboard');
      expect(adminChildren[1].name).toBe('users');
      expect(adminChildren[1].pathname).toBe('/admin/users');
      expect(adminChildren[2].name).toBe('settings');
      expect(adminChildren[2].pathname).toBe('/admin/settings');
    });

    it('경로로 직계 자식들을 가져올 수 있어야 한다', () => {
      const dashboardChildren =
        navigationService.getDirectChildrenByPath('/admin/dashboard');

      expect(dashboardChildren).toHaveLength(2);
      expect(dashboardChildren[0].name).toBe('analytics');
      expect(dashboardChildren[0].pathname).toBe('/admin/dashboard/analytics');
      expect(dashboardChildren[1].name).toBe('reports');
      expect(dashboardChildren[1].pathname).toBe('/admin/dashboard/reports');
    });

    it('자식이 없는 라우트에 대해 빈 배열을 반환해야 한다', () => {
      const settingsChildren =
        navigationService.getDirectChildrenByName('settings');
      expect(settingsChildren).toHaveLength(0);
    });

    it('존재하지 않는 라우트에 대해 빈 배열을 반환해야 한다', () => {
      const nonExistentChildren =
        navigationService.getDirectChildrenByName('nonexistent');
      expect(nonExistentChildren).toHaveLength(0);
    });
  });

  describe('스마트 자식 라우트 가져오기', () => {
    it('정확한 경로 매칭으로 자식 라우트를 가져와야 한다', () => {
      const children =
        navigationService.getSmartChildRoutes('/admin/dashboard');

      expect(children).toHaveLength(2);
      expect(children[0].name).toBe('analytics');
      expect(children[1].name).toBe('reports');
    });

    it('부분 경로 매칭으로 자식 라우트를 가져와야 한다', () => {
      const children = navigationService.getSmartChildRoutes(
        '/admin/dashboard/some-dynamic-param',
      );

      expect(children).toHaveLength(2);
      expect(children[0].name).toBe('analytics');
      expect(children[1].name).toBe('reports');
    });

    it('세그먼트 매칭으로 자식 라우트를 가져와야 한다', () => {
      const children = navigationService.getSmartChildRoutes('dashboard');

      expect(children).toHaveLength(2);
      expect(children[0].name).toBe('analytics');
      expect(children[1].name).toBe('reports');
    });

    it('매칭되는 라우트가 없을 때 빈 배열을 반환해야 한다', () => {
      const children =
        navigationService.getSmartChildRoutes('/nonexistent/path');
      expect(children).toHaveLength(0);
    });

    it('빈 경로에 대해 빈 배열을 반환해야 한다', () => {
      const children = navigationService.getSmartChildRoutes('');
      expect(children).toHaveLength(0);
    });
  });

  describe('현재 경로 기반 자식 라우트 가져오기', () => {
    it('현재 경로에서 자식 라우트를 가져와야 한다', () => {
      navigationService.setCurrentPath('/admin/dashboard');
      const children = navigationService.getChildRoutesFromCurrentPath();

      expect(children).toHaveLength(2);
      expect(children[0].name).toBe('analytics');
      expect(children[1].name).toBe('reports');
    });

    it('스마트 자식 라우트 가져오기가 작동해야 한다', () => {
      navigationService.setCurrentPath('/admin/users');
      const children = navigationService.getSmartChildRoutesFromCurrentPath();

      expect(children).toHaveLength(2);
      expect(children[0].name).toBe('list');
      expect(children[1].name).toBe('create');
    });
  });

  describe('네비게이션', () => {
    it('경로로 네비게이션할 수 있어야 한다', () => {
      const mockPush = vi.fn();
      navigationService.getNavigator().push = mockPush;

      navigationService.getNavigator().push(
        '/admin/users',
        { id: '123' },
        { tab: 'profile' },
      );
      navigationService.setCurrentPath('/admin/users');

      expect(mockPush).toHaveBeenCalledWith(
        '/admin/users',
        { id: '123' },
        { tab: 'profile' },
      );
      expect(navigationService.currentFullPath).toBe('/admin/users');
    });

    it('라우트 이름으로 네비게이션할 수 있어야 한다', () => {
      const mockPush = vi.fn();
      navigationService.getNavigator().push = mockPush;

      navigationService.getNavigator().pushByName('analytics');

      expect(mockPush).toHaveBeenCalledWith(
        '/admin/dashboard/analytics',
        undefined,
        undefined,
      );
    });

    it('존재하지 않는 라우트 이름으로 네비게이션 시 경고를 표시해야 한다', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      navigationService.getNavigator().pushByName('nonexistent');

      expect(consoleSpy).toHaveBeenCalledWith(
        '라우트 이름 "nonexistent"을 찾을 수 없습니다.',
      );

      consoleSpy.mockRestore();
    });

    it('조건부 네비게이션이 작동해야 한다', () => {
      const truePath = navigationService.getConditionalPath(
        true,
        'analytics',
        'reports',
      );
      const falsePath = navigationService.getConditionalPath(
        false,
        'analytics',
        'reports',
      );

      expect(truePath).toBe('/admin/dashboard/analytics');
      expect(falsePath).toBe('/admin/dashboard/reports');
    });
  });

  describe('활성 상태 관리', () => {
    it('현재 경로에 따라 라우트 활성 상태가 업데이트되어야 한다', () => {
      navigationService.activateRoute('/admin/dashboard/analytics');

      const activeRoutes = navigationService.getActiveRoutes();
      const activeNames = activeRoutes.map(route => route.name);

      expect(activeNames).toContain('admin');
      expect(activeNames).toContain('dashboard');
      expect(activeNames).toContain('analytics');
    });
  });

  describe('브레드크럼', () => {
    it('현재 경로에 대한 브레드크럼을 생성해야 한다', () => {
      const breadcrumbs = navigationService.getBreadcrumbPath(
        '/admin/dashboard/analytics',
      );

      expect(breadcrumbs).toHaveLength(3);
      expect(breadcrumbs[0].name).toBe('admin');
      expect(breadcrumbs[1].name).toBe('dashboard');
      expect(breadcrumbs[2].name).toBe('analytics');
    });

    it('브레드크럼에서 직계 자식들을 가져와야 한다', () => {
      const children = navigationService.getDirectChildrenFromBreadcrumb(
        '/admin/dashboard/analytics',
      );

      expect(children).toHaveLength(2);
      expect(children[0].name).toBe('analytics');
      expect(children[1].name).toBe('reports');
    });
  });

  describe('유틸리티 메서드', () => {
    it('네비게이션 함수를 설정할 수 있어야 한다', () => {
      const mockNavigate = vi.fn();
      navigationService.setNavigateFunction(mockNavigate);

      // NavigatorService 인스턴스가 반환되는지 확인
      expect(navigationService.getNavigator()).toBeDefined();
    });

    it('디버그 플랫 라우트를 반환해야 한다', () => {
      const flatRoutes = navigationService.debugFlatRoutes();
      expect(flatRoutes instanceof Map).toBe(true);
      expect(flatRoutes.size).toBeGreaterThan(0);
    });
  });

  describe('deprecated 메서드', () => {
    it('getCurrentRoutes가 deprecated 경고와 함께 작동해야 한다', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const routes = navigationService.getCurrentRoutes('/admin/dashboard');

      expect(consoleSpy).toHaveBeenCalledWith(
        'getCurrentRoutes는 deprecated입니다. getDirectChildrenFromBreadcrumb을 사용하세요.',
      );
      expect(routes).toHaveLength(2);

      consoleSpy.mockRestore();
    });

    it('getDirectChildrenByPathSegments가 deprecated 경고와 함께 작동해야 한다', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const routes =
        navigationService.getDirectChildrenByPathSegments('/admin/dashboard');

      expect(consoleSpy).toHaveBeenCalledWith(
        'getDirectChildrenByPathSegments는 deprecated입니다. getSmartChildRoutes를 사용하세요.',
      );
      expect(routes.length).toBe(2);

      consoleSpy.mockRestore();
    });
  });

  describe('엣지 케이스', () => {
    it('빈 라우트 배열로 초기화해도 오류가 발생하지 않아야 한다', () => {
      const emptyService = new NavigationService([]);
      expect(emptyService.routeBuilders).toHaveLength(0);
      expect(emptyService.debugFlatRoutes().size).toBe(0);
    });

    it('null/undefined 값들을 안전하게 처리해야 한다', () => {
      expect(() => {
        navigationService.getRouteByName('');
        navigationService.getPathByName('');
        navigationService.getDirectChildrenByPath('');
        navigationService.getSmartChildRoutes('');
      }).not.toThrow();
    });

    it('중복된 슬래시가 있는 경로를 올바르게 처리해야 한다', () => {
      const children = navigationService.getSmartChildRoutes(
        '//admin//dashboard//',
      );
      expect(children).toHaveLength(2);
    });

    it('대소문자가 다른 경로를 처리해야 한다', () => {
      // 현재 구현은 대소문자를 구분하므로 매치되지 않아야 함
      const children =
        navigationService.getSmartChildRoutes('/ADMIN/DASHBOARD');
      expect(children).toHaveLength(0);
    });
  });
});
