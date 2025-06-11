import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NavigationService } from '../navigation';

// RouteBuilder interface를 직접 정의 (circular dependency 방지)
interface RouteBuilder {
  name?: string;
  relativePath?: string;
  params?: object;
  children?: RouteBuilder[];
  icon?: string;
}

// Mock RouteBuilder 데이터
const mockRouteBuilders: RouteBuilder[] = [
  {
    name: '홈',
    relativePath: 'home',
    icon: 'Home',
  },
  {
    name: '대시보드',
    relativePath: 'dashboard',
    icon: 'Dashboard',
    children: [
      {
        name: '사용자 서비스',
        relativePath: 'user-service',
        icon: 'Users',
        children: [
          {
            name: '사용자 목록',
            relativePath: 'users',
            icon: 'User',
          },
          {
            name: '사용자 상세',
            relativePath: 'users/:id',
            icon: 'UserDetail',
          },
        ],
      },
      {
        name: '공간 서비스',
        relativePath: 'space-service',
        icon: 'Space',
        children: [
          {
            name: '공간 목록',
            relativePath: 'spaces',
            icon: 'MapPin',
          },
        ],
      },
    ],
  },
  {
    name: '설정',
    relativePath: 'settings',
    icon: 'Settings',
  },
];

describe('NavigationService', () => {
  let navigationService: NavigationService;

  beforeEach(() => {
    // window 객체 mock 설정
    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/dashboard/user-service/users',
      },
      writable: true,
    });

    navigationService = new NavigationService(mockRouteBuilders);
  });

  describe('초기화', () => {
    it('라우트 빌더로 올바르게 초기화되어야 한다', () => {
      const routes = navigationService.routes;
      expect(routes).toHaveLength(3);
      expect(routes[0].name).toBe('홈');
      expect(routes[1].name).toBe('대시보드');
      expect(routes[2].name).toBe('설정');
    });

    it('중첩된 라우트 구조가 올바르게 생성되어야 한다', () => {
      const dashboardRoute = navigationService.getRouteByName('대시보드');
      expect(dashboardRoute).toBeDefined();
      expect(dashboardRoute?.children).toHaveLength(2);
      expect(dashboardRoute?.children?.[0].name).toBe('사용자 서비스');
      expect(dashboardRoute?.children?.[1].name).toBe('공간 서비스');
    });

    it('fullPath가 올바르게 생성되어야 한다', () => {
      const homeRoute = navigationService.getRouteByName('홈');
      const dashboardRoute = navigationService.getRouteByName('대시보드');
      const userServiceRoute =
        navigationService.getRouteByName('사용자 서비스');
      const usersRoute = navigationService.getRouteByName('사용자 목록');

      expect(homeRoute?.fullPath).toBe('/home');
      expect(dashboardRoute?.fullPath).toBe('/dashboard');
      expect(userServiceRoute?.fullPath).toBe('/dashboard/user-service');
      expect(usersRoute?.fullPath).toBe('/dashboard/user-service/users');
    });
  });

  describe('라우트 검색', () => {
    it('이름으로 라우트를 찾을 수 있어야 한다', () => {
      const route = navigationService.getRouteByName('사용자 목록');
      expect(route).toBeDefined();
      expect(route?.name).toBe('사용자 목록');
      expect(route?.fullPath).toBe('/dashboard/user-service/users');
    });

    it('존재하지 않는 라우트 이름으로 검색하면 undefined를 반환해야 한다', () => {
      const route = navigationService.getRouteByName('존재하지않는라우트');
      expect(route).toBeUndefined();
    });

    it('라우트 이름으로 fullPath를 가져올 수 있어야 한다', () => {
      const path = navigationService.getFullPathByName('사용자 목록');
      expect(path).toBe('/dashboard/user-service/users');
    });

    it('getPathByName은 getFullPathByName의 별칭으로 동작해야 한다', () => {
      const fullPath = navigationService.getFullPathByName('사용자 목록');
      const path = navigationService.getPathByName('사용자 목록');
      expect(path).toBe(fullPath);
    });
  });

  describe('직계 자식 라우트 조회', () => {
    it('fullPath로 직계 자식들을 가져올 수 있어야 한다', () => {
      const children =
        navigationService.getDirectChildrenByFullPath('/dashboard');
      expect(children).toHaveLength(2);
      expect(children[0].name).toBe('사용자 서비스');
      expect(children[1].name).toBe('공간 서비스');
    });

    it('라우트 이름으로 직계 자식들을 가져올 수 있어야 한다', () => {
      const children = navigationService.getDirectChildrenByName('대시보드');
      expect(children).toHaveLength(2);
      expect(children[0].name).toBe('사용자 서비스');
      expect(children[1].name).toBe('공간 서비스');
    });

    it('자식이 없는 라우트는 빈 배열을 반환해야 한다', () => {
      const children = navigationService.getDirectChildrenByName('홈');
      expect(children).toEqual([]);
    });

    it('존재하지 않는 라우트의 자식 조회는 빈 배열을 반환해야 한다', () => {
      const children =
        navigationService.getDirectChildrenByName('존재하지않는라우트');
      expect(children).toEqual([]);
    });
  });

  describe('현재 경로 관리', () => {
    it('초기 경로가 설정되어야 한다', () => {
      expect(navigationService.currentFullPath).toBe(
        '/dashboard/user-service/users',
      );
      expect(navigationService.currentRelativePath).toBe('users');
    });

    it('setCurrentPath로 현재 경로를 변경할 수 있어야 한다', () => {
      navigationService.setCurrentPath('/dashboard/space-service/spaces');
      expect(navigationService.currentFullPath).toBe(
        '/dashboard/space-service/spaces',
      );
      expect(navigationService.currentRelativePath).toBe('spaces');
    });

    it('relativePath는 경로의 마지막 세그먼트여야 한다', () => {
      navigationService.setCurrentPath('/very/deep/nested/path');
      expect(navigationService.currentRelativePath).toBe('path');
    });

    it('빈 경로에 대해 적절히 처리해야 한다', () => {
      navigationService.setCurrentPath('');
      expect(navigationService.currentFullPath).toBe('');
      expect(navigationService.currentRelativePath).toBe('');
    });
  });

  describe('활성 상태 관리', () => {
    it('현재 경로에 해당하는 라우트들이 활성화되어야 한다', () => {
      navigationService.setCurrentPath('/dashboard/user-service/users');

      const dashboardRoute = navigationService.getRouteByName('대시보드');
      const userServiceRoute =
        navigationService.getRouteByName('사용자 서비스');
      const usersRoute = navigationService.getRouteByName('사용자 목록');
      const homeRoute = navigationService.getRouteByName('홈');

      expect(dashboardRoute?.active).toBe(true);
      expect(userServiceRoute?.active).toBe(true);
      expect(usersRoute?.active).toBe(true);
      expect(homeRoute?.active).toBe(false);
    });

    it('경로가 변경되면 활성 상태가 업데이트되어야 한다', () => {
      // 초기 상태 확인
      navigationService.setCurrentPath('/dashboard/user-service/users');
      let usersRoute = navigationService.getRouteByName('사용자 목록');
      let spacesRoute = navigationService.getRouteByName('공간 목록');
      expect(usersRoute?.active).toBe(true);
      expect(spacesRoute?.active).toBe(false);

      // 경로 변경
      navigationService.setCurrentPath('/dashboard/space-service/spaces');
      usersRoute = navigationService.getRouteByName('사용자 목록');
      spacesRoute = navigationService.getRouteByName('공간 목록');
      expect(usersRoute?.active).toBe(false);
      expect(spacesRoute?.active).toBe(true);
    });

    it('getActiveRoutes로 활성화된 모든 라우트를 가져올 수 있어야 한다', () => {
      navigationService.setCurrentPath('/dashboard/user-service/users');
      const activeRoutes = navigationService.getActiveRoutes();

      const activeNames = activeRoutes.map(route => route.name);
      expect(activeNames).toContain('대시보드');
      expect(activeNames).toContain('사용자 서비스');
      expect(activeNames).toContain('사용자 목록');
      expect(activeNames).not.toContain('홈');
      expect(activeNames).not.toContain('공간 서비스');
    });
  });

  describe('선택된 대시보드 자식 라우트', () => {
    it('현재 경로에 따라 대시보드의 적절한 자식 라우트들을 반환해야 한다', () => {
      navigationService.setCurrentPath('/dashboard/user-service/users');
      const children = navigationService.getSelectedDashboardRouteChildren();

      expect(children).toHaveLength(2);
      expect(children[0].name).toBe('사용자 목록');
      expect(children[1].name).toBe('사용자 상세');
    });

    it('대시보드가 아닌 경로에서는 빈 배열을 반환해야 한다', () => {
      navigationService.setCurrentPath('/home');
      const children = navigationService.getSelectedDashboardRouteChildren();
      expect(children).toEqual([]);
    });

    it('매칭되는 대시보드 자식이 없으면 빈 배열을 반환해야 한다', () => {
      navigationService.setCurrentPath('/dashboard/unknown-service');
      const children = navigationService.getSelectedDashboardRouteChildren();
      expect(children).toEqual([]);
    });
  });

  describe('Navigator Service 통합', () => {
    it('NavigatorService 인스턴스를 반환해야 한다', () => {
      const navigator = navigationService.getNavigator();
      expect(navigator).toBeDefined();
      expect(typeof navigator.push).toBe('function');
    });

    it('navigate 함수를 설정할 수 있어야 한다', () => {
      const mockNavigate = vi.fn();
      navigationService.setNavigateFunction(mockNavigate);

      const navigator = navigationService.getNavigator();
      navigator.push('/test-path');

      expect(mockNavigate).toHaveBeenCalledWith('/test-path');
    });
  });

  describe('경로 정규화 및 매칭', () => {
    it('앞/뒤 슬래시가 있는 경로도 올바르게 매칭되어야 한다', () => {
      navigationService.setCurrentPath('dashboard/user-service/users'); // 앞 슬래시 없음
      const usersRoute = navigationService.getRouteByName('사용자 목록');
      expect(usersRoute?.active).toBe(true);
    });

    it('부분 경로 매칭이 올바르게 동작해야 한다', () => {
      navigationService.setCurrentPath('/dashboard/user-service');
      const dashboardRoute = navigationService.getRouteByName('대시보드');
      const userServiceRoute =
        navigationService.getRouteByName('사용자 서비스');

      expect(dashboardRoute?.active).toBe(true);
      expect(userServiceRoute?.active).toBe(true);
    });
  });

  describe('특수 케이스 및 에러 처리', () => {
    it('빈 RouteBuilder 배열로 초기화해도 정상 동작해야 한다', () => {
      const emptyNavigation = new NavigationService([]);
      expect(emptyNavigation.routes).toEqual([]);
      expect(emptyNavigation.getRouteByName('test')).toBeUndefined();
    });

    it('pathname 속성을 가진 legacy RouteBuilder도 처리해야 한다', () => {
      const legacyRouteBuilders = [
        {
          name: '레거시 라우트',
          pathname: 'legacy', // relativePath 대신 pathname 사용
          icon: 'Legacy',
        },
      ] as any;

      const legacyNavigation = new NavigationService(legacyRouteBuilders);
      const route = legacyNavigation.getRouteByName('레거시 라우트');
      expect(route?.fullPath).toBe('/legacy');
    });

    it('잘못된 경로 형식에 대해 적절히 처리해야 한다', () => {
      navigationService.setCurrentPath('///multiple///slashes///');
      expect(navigationService.currentFullPath).toBe(
        '///multiple///slashes///',
      );
      // 서비스가 crash되지 않아야 함
      expect(() => navigationService.getActiveRoutes()).not.toThrow();
    });
  });

  describe('RouteBuilder 설정 업데이트', () => {
    it('setRoutes로 라우트를 다시 설정할 수 있어야 한다', () => {
      const newRouteBuilders: RouteBuilder[] = [
        {
          name: '새 라우트',
          relativePath: 'new-route',
          icon: 'New',
        },
      ];

      navigationService.setRoutes(newRouteBuilders);
      expect(navigationService.routes).toHaveLength(1);
      expect(navigationService.getRouteByName('새 라우트')).toBeDefined();
      expect(navigationService.getRouteByName('홈')).toBeUndefined();
    });
  });
});
