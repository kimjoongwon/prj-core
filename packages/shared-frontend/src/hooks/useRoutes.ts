import { useMemo } from 'react';
import { useUnifiedNavigation } from './useUnifiedNavigation';
import { RouteBuilder } from '@shared/types';
import { useLocation } from 'react-router';

/**
 * 특정 경로의 하위 라우트들을 간편하게 가져오는 훅
 */
export function useRoutes(pathname?: string): RouteBuilder[] {
  const { navigationService } = useUnifiedNavigation();

  return useMemo(() => {
    if (!pathname) return [];
    return navigationService.getRoutesByPathname(pathname);
  }, [navigationService, pathname]);
}

/**
 * 대시보드 라우트들을 가져오는 전용 훅
 */
export function useDashboardRoutes(): RouteBuilder[] {
  return useRoutes('dashboard');
}

/**
 * 현재 경로의 하위 라우트들을 가져오는 훅
 */
export function useCurrentRoutes(): RouteBuilder[] {
  const { currentPath, navigationService } = useUnifiedNavigation();

  return useMemo(() => {
    return navigationService.getCurrentRoutes(currentPath);
  }, [navigationService, currentPath]);
}

/**
 * 현재 브라우저 경로를 기반으로 자식 라우트들을 자동으로 가져오는 훅
 */
export function useCurrentLocationRoutes(): RouteBuilder[] {
  const { navigationService } = useUnifiedNavigation();
  const location = useLocation();

  return useMemo(() => {
    return navigationService.getRoutesByPathname(location.pathname);
  }, [navigationService, location.pathname]);
}

/**
 * 경로 세그먼트를 기반으로 가장 적절한 자식 라우트들을 가져오는 훅
 */
export function useSmartRoutes(pathname?: string): RouteBuilder[] {
  const { navigationService } = useUnifiedNavigation();
  const location = useLocation();

  const targetPath = pathname || location.pathname;

  return useMemo(() => {
    return navigationService.getSmartChildRoutes(targetPath);
  }, [navigationService, targetPath]);
}
