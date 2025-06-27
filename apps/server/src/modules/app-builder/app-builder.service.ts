import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { RouteBuilder, PageBuilder, RouteNames } from '@shared/types';
import { rawRoutes } from '@shared/vars';
import { LoginPage } from './components/pages/login.page';
import { TenantSelectPage } from './components/pages/tenant-select.page';
import { UsersPage } from './components/pages/users.page';
import { DashboardPage } from './components/pages/dashboard.page';
import { GroundsPage } from './components/pages/grounds.page';
import { GroundPage } from './components/pages/ground.page';
import { CategoriesPage } from './components/pages/categories.page';
import { GroupsPage } from './components/pages/groups.page';
import { CategoryPage } from './components/pages/category.page';
import { GroupPage } from './components/pages/group.page';

// 라우트 타입 상수
const ROUTE_TYPES = {
  ADMIN: '관리자',
  AUTH: '인증',
  LOGIN: '로그인',
  TENANT_SELECT: '테넌트 선택',
  DASHBOARD: '대시보드',
} as const;

@Injectable()
export class AppBuilderService {
  private routes: RouteBuilder[];

  constructor(
    readonly prisma: PrismaService,
    readonly loginPage: LoginPage,
    readonly tenantSelectPage: TenantSelectPage,
    readonly dashboardPage: DashboardPage,
    readonly usersPage: UsersPage,
    readonly groundsPage: GroundsPage,
    readonly groundPage: GroundPage,
    readonly categoriesPage: CategoriesPage,
    readonly groupsPage: GroupsPage,
    readonly categoryPage: CategoryPage,
    readonly groupPage: GroupPage,
  ) {
    this.routes = this.initializeRoutes();
  }

  /**
   * 라우트 초기화 (null safety 보장)
   */
  private initializeRoutes(): RouteBuilder[] {
    return rawRoutes && Array.isArray(rawRoutes) ? [...rawRoutes] : [];
  }

  async build(isAuthenticated: boolean = false) {
    try {
      // 인증 상태에 따른 라우트 설정
      this.setupRoutesBasedOnAuth(isAuthenticated);

      // 페이지 빌더 생성
      const pageBuilders = await this.createPageBuilders();

      // 기본 라우트 설정 (인증 관련)
      this.setupAuthRoutes(pageBuilders);

      // 대시보드 라우트 설정 (인증된 사용자만)
      if (this.shouldSetupDashboardRoutes(isAuthenticated)) {
        this.setupDashboardRoutes(pageBuilders);
      }

      return {
        routes: this.routes,
      };
    } catch (error) {
      console.error('Error in AppBuilderService.build():', error);
      return {
        routes: this.routes || [],
      };
    }
  }

  /**
   * 인증 상태에 따른 라우트 설정
   */
  private setupRoutesBasedOnAuth(isAuthenticated: boolean): void {
    if (isAuthenticated) {
      // 인증된 사용자: 모든 라우트 (dashboard 포함)
      this.routes = this.initializeRoutes();
    } else {
      // 비인증 사용자: auth 라우트만
      this.routes = this.getAuthRoutes();
    }
  }

  /**
   * 페이지 빌더들 생성
   */
  private async createPageBuilders() {
    return {
      login: this.loginPage.build(),
      tenantSelect: await this.tenantSelectPage.build(),
      dashboard: this.dashboardPage.build(),
      users: this.usersPage.build(),
      grounds: this.groundsPage.build(),
      groundCreate: this.groundPage.build('create'),
      groundModify: this.groundPage.build('modify'),
      groundDetail: this.groundPage.build('detail'),
      categories: this.categoriesPage.build('Space'),
      categoryDetail: this.categoryPage.build('detail', 'Space'),
      categoryCreate: this.categoryPage.build('create', 'Space'),
      categoryModify: this.categoryPage.build('modify', 'Space'),
      categoryAdd: this.categoryPage.build('add', 'Space'),
      groups: this.groupsPage.build('Space'),
      groupCreate: this.groupPage.build('create', 'Space'),
      groupModify: this.groupPage.build('modify', 'Space'),
      groupDetail: this.groupPage.build('detail', 'Space'),
    };
  }

  /**
   * 인증 관련 라우트 설정
   */
  private setupAuthRoutes(pageBuilders: any): void {
    this.setRoutePageAndLayout(ROUTE_TYPES.ADMIN, undefined);
    this.setRoutePageAndLayout(ROUTE_TYPES.AUTH, undefined);
    this.setRoutePageAndLayout(ROUTE_TYPES.LOGIN, pageBuilders.login);
  }

  /**
   * 대시보드 라우트 설정 여부 확인
   */
  private shouldSetupDashboardRoutes(isAuthenticated: boolean): boolean {
    return isAuthenticated || this.hasDashboardRoute();
  }

  /**
   * 대시보드 라우트 존재 여부 확인
   */
  private hasDashboardRoute(): boolean {
    return (
      this.routes?.some((route) =>
        route?.children?.some((child) => child?.name === ROUTE_TYPES.DASHBOARD),
      ) ?? false
    );
  }

  /**
   * 대시보드 관련 라우트 설정
   */
  private setupDashboardRoutes(pageBuilders: any): void {
    this.setRoutePageAndLayout('대시보드', pageBuilders.dashboard);
    this.setRoutePageAndLayout('테넌트 선택', pageBuilders.tenantSelect);
    this.setRoutePageAndLayout('유저', pageBuilders.users);
    this.setRoutePageAndLayout('그라운드 리스트', pageBuilders.grounds);
    this.setRoutePageAndLayout('그라운드 생성', pageBuilders.groundCreate);
    this.setRoutePageAndLayout('그라운드 수정', pageBuilders.groundModify);
    this.setRoutePageAndLayout('그라운드 상세', pageBuilders.groundDetail);
    this.setRoutePageAndLayout('그라운드 카테고리 디테일', pageBuilders.categoryDetail);
    this.setRoutePageAndLayout('그라운드 카테고리', pageBuilders.categories);
    this.setRoutePageAndLayout('그라운드 카테고리 생성', pageBuilders.categoryCreate);
    this.setRoutePageAndLayout('그라운드 카테고리 수정', pageBuilders.categoryModify);
    this.setRoutePageAndLayout('그라운드 카테고리 추가', pageBuilders.categoryAdd);
    this.setRoutePageAndLayout('그라운드 그룹', pageBuilders.groups);
    this.setRoutePageAndLayout('그라운드 그룹 생성', pageBuilders.groupCreate);
    this.setRoutePageAndLayout('그라운드 그룹 수정', pageBuilders.groupModify);
    this.setRoutePageAndLayout('그라운드 그룹 디테일', pageBuilders.groupDetail);
  }

  /**
   * 인증되지 않은 사용자용 라우트 (auth 경로만)
   */
  private getAuthRoutes(): RouteBuilder[] {
    if (!this.isValidRawRoutes()) {
      return [];
    }

    return rawRoutes.map((route) => this.filterAdminRouteForAuth(route));
    // .filter((route) => this.isValidAuthRoute(route)) as RouteBuilder[];
  }

  /**
   * rawRoutes의 유효성 검사
   */
  private isValidRawRoutes(): boolean {
    return rawRoutes && Array.isArray(rawRoutes);
  }

  /**
   * 관리자 라우트에서 인증 관련 자식만 필터링
   */
  private filterAdminRouteForAuth(route: RouteBuilder): RouteBuilder | null {
    if (!route?.name) {
      return null;
    }

    if (route.name === ROUTE_TYPES.ADMIN) {
      const authChildren =
        route.children?.filter((child) => child?.name === ROUTE_TYPES.AUTH) || [];

      return {
        ...route,
        children: authChildren,
      };
    }

    return route;
  }

  /**
   * 유효한 인증 라우트인지 확인
   */
  private isValidAuthRoute(route: RouteBuilder | null): boolean {
    return (
      route !== null &&
      route?.name === ROUTE_TYPES.ADMIN &&
      route.children &&
      Array.isArray(route.children) &&
      route.children.some((child) => child?.name === ROUTE_TYPES.AUTH)
    );
  }

  /**
   * Routes 배열에서 name과 일치하는 항목을 찾아 page와 layout을 설정하는 함수
   * @param name - 찾을 route의 name
   * @param pageBuilder - 설정할 PageBuilder 데이터
   */
  setRoutePageAndLayout(name: RouteNames, pageBuilder?: PageBuilder): void {
    this.findAndSetRoute(this.routes, name, pageBuilder);
  }

  /**
   * 라우트를 재귀적으로 탐색하여 설정
   */
  private findAndSetRoute(
    routeList: RouteBuilder[],
    targetName: RouteNames,
    pageBuilder?: PageBuilder,
  ): boolean {
    if (!this.isValidRouteList(routeList)) {
      return false;
    }

    for (const route of routeList) {
      if (!this.isValidRoute(route)) {
        continue;
      }

      // 현재 route의 name이 일치하는 경우
      if (route.name === targetName) {
        if (pageBuilder) {
          route.page = pageBuilder;
        }
        return true;
      }

      // children이 있는 경우 재귀적으로 탐색
      if (this.hasValidChildren(route)) {
        const found = this.findAndSetRoute(route.children!, targetName, pageBuilder);
        if (found) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * 라우트 리스트의 유효성 검사
   */
  private isValidRouteList(routeList: RouteBuilder[]): boolean {
    return routeList && Array.isArray(routeList);
  }

  /**
   * 개별 라우트의 유효성 검사
   */
  private isValidRoute(route: RouteBuilder): boolean {
    return route && !!route.name;
  }

  /**
   * 유효한 자식 라우트가 있는지 확인
   */
  private hasValidChildren(route: RouteBuilder): boolean {
    return route.children && Array.isArray(route.children) && route.children.length > 0;
  }
}
