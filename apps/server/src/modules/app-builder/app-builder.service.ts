import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { RouteBuilder, PageBuilder, LayoutBuilder, RouteNames } from '@shared/types';
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
    // rawRoutes를 deep copy하여 초기화 (null safety 체크)
    this.routes = rawRoutes && Array.isArray(rawRoutes) ? [...rawRoutes] : [];
  }

  async build(isAuthenticated: boolean = false) {
    try {
      // 로그인 페이지 설정
      const loginPageBuilder: PageBuilder = this.loginPage.build();
      const tenantSelectPageBuilder: PageBuilder = await this.tenantSelectPage.build();
      const dashboardPageBuilder: PageBuilder = this.dashboardPage.build();
      const usersPageBuilder: PageBuilder = this.usersPage.build();
      const groundsPageBuilder: PageBuilder = this.groundsPage.build();
      const groundCreatePageBuilder: PageBuilder = this.groundPage.build('create');
      const groundModifyPageBuilder: PageBuilder = this.groundPage.build('modify');
      const groundDetailPageBuilder: PageBuilder = this.groundPage.build('detail');
      const categoriesPageBuilder: PageBuilder = this.categoriesPage.build('Space');
      const categoryDetailPageBuilder: PageBuilder = this.categoryPage.build('detail', 'Space');
      const categoryCreatePageBuilder: PageBuilder = this.categoryPage.build('create', 'Space');
      const categoryModifyPageBuilder: PageBuilder = this.categoryPage.build('modify', 'Space');
      const categoryAddPageBuilder: PageBuilder = this.categoryPage.build('add', 'Space');
      const groupsPageBuilder: PageBuilder = this.groupsPage.build('Space');
      const groupCreatePageBuilder: PageBuilder = this.groupPage.build('create', 'Space');
      const groupModifyPageBuilder: PageBuilder = this.groupPage.build('modify', 'Space');

      // 인증된 사용자는 모든 라우트 접근 가능, 비인증 사용자는 auth 라우트만
      if (isAuthenticated) {
        // 인증된 사용자: 모든 라우트 제공
        this.routes = rawRoutes && Array.isArray(rawRoutes) ? [...rawRoutes] : [];
      } else {
        // 비인증 사용자: auth 라우트만 제공
        this.routes = this.getAuthRoutes();
      }

      this.setRoutePageAndLayout('관리자', undefined);
      this.setRoutePageAndLayout('인증', undefined);
      this.setRoutePageAndLayout('로그인', loginPageBuilder);
      this.setRoutePageAndLayout('테넌트 선택', tenantSelectPageBuilder);

      // 대시보드 관련 페이지 설정 (인증된 사용자 또는 모든 라우트가 포함된 경우에만)
      if (
        isAuthenticated ||
        (this.routes &&
          Array.isArray(this.routes) &&
          this.routes.some(
            (route) =>
              route &&
              route.children &&
              Array.isArray(route.children) &&
              route.children.some((child) => child && child.name === '대시보드'),
          ))
      ) {
        this.setRoutePageAndLayout('대시보드', dashboardPageBuilder);
        this.setRoutePageAndLayout('유저', usersPageBuilder);
        this.setRoutePageAndLayout('그라운드 리스트', groundsPageBuilder);
        this.setRoutePageAndLayout('그라운드 생성', groundCreatePageBuilder);
        this.setRoutePageAndLayout('그라운드 수정', groundModifyPageBuilder);
        this.setRoutePageAndLayout('그라운드 상세', groundDetailPageBuilder);
        this.setRoutePageAndLayout('그라운드 카테고리 디테일', categoryDetailPageBuilder);
        this.setRoutePageAndLayout('그라운드 카테고리', categoriesPageBuilder);
        this.setRoutePageAndLayout('그라운드 카테고리 생성', categoryCreatePageBuilder);
        this.setRoutePageAndLayout('그라운드 카테고리 수정', categoryModifyPageBuilder);
        this.setRoutePageAndLayout('그라운드 카테고리 추가', categoryAddPageBuilder);
        this.setRoutePageAndLayout('그라운드 그룹', groupsPageBuilder);
        this.setRoutePageAndLayout('그라운드 그룹 생성', groupCreatePageBuilder);
        this.setRoutePageAndLayout('그라운드 그룹 수정', groupModifyPageBuilder);
        // this.setRoutePageAndLayout('그라운드 그룹 편집', groupModifyPageBuilder);
      }

      return {
        routes: this.routes,
      };
    } catch (error) {
      console.error('Error in AppBuilderService.build():', error);
      // 에러 발생시 기본 라우트 반환
      return {
        routes: this.routes || [],
      };
    }
  }

  /**
   * 인증되지 않은 사용자용 라우트 (auth 경로만)
   */
  private getAuthRoutes(): RouteBuilder[] {
    if (!rawRoutes || !Array.isArray(rawRoutes)) {
      return [];
    }

    return rawRoutes
      .map((route) => {
        if (!route || !route.name) {
          return null;
        }

        if (route.name === '관리자') {
          const filteredChildren =
            route.children?.filter((child) => child && child.name === '인증') || [];

          return {
            ...route,
            children: filteredChildren,
          };
        }
        return route;
      })
      .filter((route) => {
        return (
          route !== null &&
          route?.name === '관리자' &&
          route.children &&
          Array.isArray(route.children) &&
          route.children.some((child) => child && child.name === '인증')
        );
      }) as RouteBuilder[];
  }

  /**
   * Routes 배열에서 name과 일치하는 항목을 찾아 page와 layout을 설정하는 함수
   * @param name - 찾을 route의 name
   * @param pageBuilder - 설정할 PageBuilder 데이터
   */
  setRoutePageAndLayout(name: RouteNames, pageBuilder?: PageBuilder): void {
    const findAndSetRoute = (routeList: RouteBuilder[]): boolean => {
      if (!routeList || !Array.isArray(routeList)) {
        return false;
      }

      for (const route of routeList) {
        // route와 route.name이 null/undefined가 아닌지 확인
        if (!route || !route.name) {
          continue;
        }

        // 현재 route의 name이 일치하는 경우
        if (route.name === name) {
          if (pageBuilder) {
            route.page = pageBuilder;
          }

          return true; // 찾았음을 나타냄
        }

        // children이 있는 경우 재귀적으로 탐색
        if (route.children && Array.isArray(route.children) && route.children.length > 0) {
          const found = findAndSetRoute(route.children);
          if (found) {
            return true;
          }
        }
      }
      return false; // 찾지 못함
    };

    findAndSetRoute(this.routes);
  }
}
