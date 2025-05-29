import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { routeNavigator } from '../services/RouteNavigator';

/**
 * 라우트 네비게이션 훅
 * 이름으로 라우터 이동과 조건부 라우팅 기능을 제공합니다.
 */
export const useRouteNavigator = () => {
  const router = useRouter();

  /**
   * 라우트 이름으로 이동
   */
  const navigateByName = (routeName: string): void => {
    const path = routeNavigator.getPathByName(routeName);
    if (path) {
      router.push(path);
    } else {
      console.error(`라우트 이름 '${routeName}'에 해당하는 경로를 찾을 수 없습니다.`);
    }
  };

  /**
   * 조건에 따라 서로 다른 경로로 이동
   */
  const navigateByCondition = (
    condition: boolean,
    routeNameIfTrue: string,
    routeNameIfFalse: string
  ): void => {
    const path = routeNavigator.getConditionalPath(
      condition,
      routeNameIfTrue,
      routeNameIfFalse
    );
    
    if (path) {
      router.push(path);
    } else {
      console.error('조건부 경로 이동 실패: 유효한 경로를 찾을 수 없습니다.');
    }
  };

  return {
    navigateByName,
    navigateByCondition,
  };
};
