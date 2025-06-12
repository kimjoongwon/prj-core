import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { RouteBuilder, PageBuilder, LayoutBuilder, RouteNames } from '@shared/types';
import { rawRoutes } from '@shared/vars';
import { LoginPage } from './components/pages/login.page';
import { TenantSelectPage } from './components/pages/tenant-select.page';
import { UsersPage } from './components/pages/users.page';
import { DashboardPage } from './components/pages/dashboard.page';

@Injectable()
export class AppBuilderService {
  private routes: RouteBuilder[];

  constructor(
    readonly prisma: PrismaService,
    readonly loginPage: LoginPage,
    readonly tenantSelectPage: TenantSelectPage,
    readonly dashboardPage: DashboardPage,
    readonly usersPage: UsersPage,
  ) {
    // rawRoutes를 deep copy하여 초기화
    this.routes = rawRoutes;
  }

  async build(isAuthenticated: boolean = false) {
    // 로그인 페이지 설정
    const loginPageBuilder: PageBuilder = this.loginPage.build();
    const tenantSelectPageBuilder: PageBuilder = await this.tenantSelectPage.build();
    const dashboardPageBuilder: PageBuilder = this.dashboardPage.build();
    const usersPageBuilder: PageBuilder = this.usersPage.build();

    // 인증된 사용자는 모든 라우트 접근 가능, 비인증 사용자는 auth 라우트만
    if (isAuthenticated) {
      // 인증된 사용자: 모든 라우트 제공
      this.routes = rawRoutes;
    } else {
      // 비인증 사용자: auth 라우트만 제공
      this.routes = this.getAuthRoutes();
    }

    this.setRoutePageAndLayout('관리자', undefined, {
      type: 'Root',
    });

    // 인증 관련 페이지 설정 (모든 사용자에게 제공)
    this.setRoutePageAndLayout('인증', undefined, {
      type: 'Auth',
    });

    this.setRoutePageAndLayout('로그인', loginPageBuilder, {
      type: 'Root',
    });

    this.setRoutePageAndLayout('테넌트 선택', tenantSelectPageBuilder, {
      type: 'Modal',
    });

    // 대시보드 관련 페이지 설정 (인증된 사용자 또는 모든 라우트가 포함된 경우에만)
    if (
      isAuthenticated ||
      this.routes.some((route) => route.children?.some((child) => child.name === '대시보드'))
    ) {
      this.setRoutePageAndLayout('대시보드', dashboardPageBuilder, {
        type: 'Dashboard',
      });

      this.setRoutePageAndLayout('유저', usersPageBuilder);
    }

    return {
      routes: this.routes,
    };
  }

  /**
   * 인증되지 않은 사용자용 라우트 (auth 경로만)
   */
  private getAuthRoutes(): RouteBuilder[] {
    return rawRoutes
      .map((route) => {
        if (route.name === '관리자') {
          return {
            ...route,
            children: route.children?.filter((child) => child.name === '인증') || [],
          };
        }
        return route;
      })
      .filter(
        (route) =>
          route.name === '관리자' && route.children?.some((child) => child.name === '인증'),
      );
  }

  /**
   * Routes 배열에서 name과 일치하는 항목을 찾아 page와 layout을 설정하는 함수
   * @param name - 찾을 route의 name
   * @param pageBuilder - 설정할 PageBuilder 데이터
   * @param layoutBuilder - 설정할 LayoutBuilder 데이터
   */
  setRoutePageAndLayout(
    name: RouteNames,
    pageBuilder?: PageBuilder,
    layoutBuilder?: LayoutBuilder,
  ): void {
    const findAndSetRoute = (routeList: RouteBuilder[]): boolean => {
      for (const route of routeList) {
        // 현재 route의 name이 일치하는 경우
        if (route.name === name) {
          if (pageBuilder) {
            route.page = pageBuilder;
          }
          if (layoutBuilder) {
            route.layout = layoutBuilder;
          }
          return true; // 찾았음을 나타냄
        }

        // children이 있는 경우 재귀적으로 탐색
        if (route.children && route.children.length > 0) {
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
