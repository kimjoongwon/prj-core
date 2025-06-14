'use client';

import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Plate } from '../../providers/App/AppProvider';

/**
 * Router 컨텍스트 내부에서 navigation 함수를 설정하는 컴포넌트
 * 이 컴포넌트는 Router 내부에서만 사용되어야 합니다.
 */
export const NavigationSetup = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Plate이 초기화되었을 때 navigation 함수 설정
    if (Plate?.navigation) {
      Plate.navigation.setNavigateFunction(navigate);

      // 페이지 새로고침 시 저장된 경로로 리다이렉트 (약간의 지연을 두어 안정성 확보)
      const restoreNavigation = () => {
        const currentPath = window.location.pathname;
        const savedPath = Plate.navigation.currentFullPath;

        // 현재 경로가 루트이고 저장된 경로가 있으면 저장된 경로로 리다이렉트
        if (
          (currentPath === '/' || currentPath === '') &&
          savedPath &&
          savedPath !== '/' &&
          savedPath !== currentPath
        ) {
          // 유효한 라우트인지 확인 - public routes getter 사용
          const allRoutes = Plate.navigation.routes;
          const isValidRoute = allRoutes.some(route => {
            const checkRoute = (r: any): boolean => {
              if (r.fullPath === savedPath) return true;
              if (r.children) {
                return r.children.some(checkRoute);
              }
              return false;
            };
            return checkRoute(route);
          });

          if (isValidRoute) {
            navigate(savedPath, { replace: true });
          }
        } else if (currentPath && currentPath !== '/') {
          // 현재 경로가 있으면 네비게이션 서비스에 활성화
          Plate.navigation.activateRoute(currentPath);
        }
      };

      // 약간의 지연을 두어 라우터가 완전히 초기화된 후 실행
      const timeoutId = setTimeout(restoreNavigation, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [navigate]);

  // 이 컴포넌트는 렌더링하지 않음
  return null;
};

NavigationSetup.displayName = 'NavigationSetup';
