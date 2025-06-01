import { useCallback, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { UnifiedNavigationService } from '../services/UnifiedNavigationService';
import { RouteBuilder, Route } from '@shared/specs';

/**
 * UnifiedNavigationService를 React 컴포넌트에서 사용하기 위한 훅
 */
export function useUnifiedNavigation(routeBuilders?: RouteBuilder[]) {
  const navigate = useNavigate();
  const location = useLocation();

  // UnifiedNavigationService 인스턴스 생성 및 메모이제이션
  const navigationService = useMemo(() => {
    return new UnifiedNavigationService(routeBuilders || []);
  }, [routeBuilders]);

  // navigate 함수 설정
  useEffect(() => {
    navigationService.setNavigateFunction(navigate);
  }, [navigate, navigationService]);

  // 경로 변경 시 활성 상태 업데이트
  useEffect(() => {
    navigationService.activateRoute(location.pathname);
  }, [location.pathname, navigationService]);

  // 이름으로 네비게이션
  const navigateByName = useCallback(
    (
      routeName: string,
      pathParams?: object,
      searchParams?: Record<string, string>,
    ) => {
      navigationService.pushByName(routeName, pathParams, searchParams);
    },
    [navigationService],
  );

  // 조건부 네비게이션
  const navigateConditional = useCallback(
    (
      condition: boolean,
      routeNameIfTrue: string,
      routeNameIfFalse: string,
      pathParams?: object,
      searchParams?: Record<string, string>,
    ) => {
      navigationService.pushConditional(
        condition,
        routeNameIfTrue,
        routeNameIfFalse,
        pathParams,
        searchParams,
      );
    },
    [navigationService],
  );

  // 경로로 네비게이션 (기존 방식)
  const navigateByPath = useCallback(
    (
      pathname: string,
      pathParams?: object,
      searchParams?: Record<string, string>,
    ) => {
      navigationService.push(pathname, pathParams, searchParams);
    },
    [navigationService],
  );

  // 현재 브레드크럼 가져오기
  const breadcrumbs = useMemo(() => {
    return navigationService.getBreadcrumbPath(location.pathname);
  }, [location.pathname, navigationService]);

  // 현재 활성 라우트들
  const activeRoutes = useMemo(() => {
    return navigationService.getActiveRoutes();
  }, [location.pathname, navigationService]);

  // 경로 가져오기
  const getPathByName = useCallback(
    (routeName: string) => {
      return navigationService.getPathByName(routeName);
    },
    [navigationService],
  );

  // 조건부 경로 가져오기
  const getConditionalPath = useCallback(
    (condition: boolean, routeNameIfTrue: string, routeNameIfFalse: string) => {
      return navigationService.getConditionalPath(
        condition,
        routeNameIfTrue,
        routeNameIfFalse,
      );
    },
    [navigationService],
  );

  return {
    // 네비게이션 메서드들
    navigateByName,
    navigateConditional,
    navigateByPath,

    // 경로 조회 메서드들
    getPathByName,
    getConditionalPath,

    // 상태 정보
    breadcrumbs,
    activeRoutes,
    currentPath: location.pathname,

    // 서비스 인스턴스 (고급 사용자용)
    navigationService,
  };
}

/**
 * 글로벌 UnifiedNavigationService 인스턴스를 사용하는 간단한 훅
 */
export function useGlobalNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  // 글로벌 서비스 import
  const {
    unifiedNavigationService,
  } = require('../services/UnifiedNavigationService');

  // navigate 함수 설정
  useEffect(() => {
    unifiedNavigationService.setNavigateFunction(navigate);
  }, [navigate]);

  // 경로 변경 시 활성 상태 업데이트
  useEffect(() => {
    unifiedNavigationService.activateRoute(location.pathname);
  }, [location.pathname]);

  // 이름으로 네비게이션
  const navigateByName = useCallback(
    (
      routeName: string,
      pathParams?: object,
      searchParams?: Record<string, string>,
    ) => {
      unifiedNavigationService.pushByName(routeName, pathParams, searchParams);
    },
    [],
  );

  // 조건부 네비게이션
  const navigateConditional = useCallback(
    (
      condition: boolean,
      routeNameIfTrue: string,
      routeNameIfFalse: string,
      pathParams?: object,
      searchParams?: Record<string, string>,
    ) => {
      unifiedNavigationService.pushConditional(
        condition,
        routeNameIfTrue,
        routeNameIfFalse,
        pathParams,
        searchParams,
      );
    },
    [],
  );

  // 경로로 네비게이션 (기존 방식)
  const navigateByPath = useCallback(
    (
      pathname: string,
      pathParams?: object,
      searchParams?: Record<string, string>,
    ) => {
      unifiedNavigationService.push(pathname, pathParams, searchParams);
    },
    [],
  );

  // 현재 브레드크럼 가져오기
  const breadcrumbs = useMemo(() => {
    return unifiedNavigationService.getBreadcrumbPath(location.pathname);
  }, [location.pathname]);

  // 현재 활성 라우트들
  const activeRoutes = useMemo(() => {
    return unifiedNavigationService.getActiveRoutes();
  }, [location.pathname]);

  // 경로 가져오기
  const getPathByName = useCallback((routeName: string) => {
    return unifiedNavigationService.getPathByName(routeName);
  }, []);

  // 조건부 경로 가져오기
  const getConditionalPath = useCallback(
    (condition: boolean, routeNameIfTrue: string, routeNameIfFalse: string) => {
      return unifiedNavigationService.getConditionalPath(
        condition,
        routeNameIfTrue,
        routeNameIfFalse,
      );
    },
    [],
  );

  return {
    // 네비게이션 메서드들
    navigateByName,
    navigateConditional,
    navigateByPath,

    // 경로 조회 메서드들
    getPathByName,
    getConditionalPath,

    // 상태 정보
    breadcrumbs,
    activeRoutes,
    currentPath: location.pathname,

    // 서비스 인스턴스 (고급 사용자용)
    navigationService: unifiedNavigationService,
  };
}

/**
 * @deprecated useRouteNavigator는 더 이상 권장되지 않습니다. useUnifiedNavigation 또는 useGlobalNavigation을 사용하세요.
 */
export function useRouteNavigator() {
  console.warn(
    'useRouteNavigator는 deprecated입니다. useUnifiedNavigation 또는 useGlobalNavigation을 사용하세요.',
  );
  return useGlobalNavigation();
}
