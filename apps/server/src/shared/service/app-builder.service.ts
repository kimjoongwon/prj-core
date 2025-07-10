import { Injectable } from '@nestjs/common';
import type { RouteBuilder } from '@shared/types';
import type { PrismaService } from 'nestjs-prisma';
import { rawRoutes } from '../vars/routes';

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

  constructor(readonly prisma: PrismaService) {
    this.routes = this.initializeRoutes();
  }

  /**
   * 라우트 초기화 (null safety 보장)
   */
  private initializeRoutes(): RouteBuilder[] {
    return rawRoutes && Array.isArray(rawRoutes) ? [...rawRoutes] : [];
  }

  async build(isAuthenticated = false) {
    try {
      // 인증 상태에 따른 라우트 설정
      this.setupRoutesBasedOnAuth(isAuthenticated);

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
   * 인증되지 않은 사용자용 라우트 (auth 경로만)
   */
  private getAuthRoutes(): RouteBuilder[] {
    if (!this.isValidRawRoutes()) {
      return [];
    }

    return rawRoutes.map((route) => this.filterAdminRouteForAuth(route));
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
}
