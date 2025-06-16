import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Plate } from '../../../providers';
import { reaction } from 'mobx';

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

      // currentFullPath 변경을 감지하여 실제 네비게이션 수행
      const navigationReaction = reaction(
        () => Plate.navigation.currentFullPath,
        (currentRoute, previousRoute) => {
          // 순환 호출 방지: 현재 브라우저 경로와 다를 때만 네비게이션 수행
          const browserPath = window.location.pathname;
          if (
            currentRoute &&
            currentRoute !== browserPath &&
            currentRoute !== previousRoute
          ) {
            console.log(
              `NavigationSetup: Navigating from ${browserPath} to ${currentRoute}`,
            );
            // navigator.push 사용 (navigate 대신)
            Plate.navigation.getNavigator().push(currentRoute);
          }
        },
      );

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
            // navigator.push 사용 (navigate 대신)
            Plate.navigation.getNavigator().push(savedPath);
          }
        } else if (currentPath && currentPath !== '/') {
          // 현재 경로가 있으면 네비게이션 서비스에 활성화
          Plate.navigation.activateRoute(currentPath);
        }
      };

      // 약간의 지연을 두어 라우터가 완전히 초기화된 후 실행
      const timeoutId = setTimeout(restoreNavigation, 100);

      return () => {
        clearTimeout(timeoutId);
        navigationReaction(); // reaction dispose
      };
    }
  }, [navigate]);

  // 이 컴포넌트는 렌더링하지 않음
  return null;
};

NavigationSetup.displayName = 'NavigationSetup';
