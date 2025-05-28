import {
  createBrowserRouter,
  RouterProvider,
  type RouteObject,
} from 'react-router';
import { type RouteBuilder as IRouteBuilder } from '@shared/types';
import { ILLIT, RouteBuilder } from '@shared/frontend';
import { v4 } from 'uuid';
import { observer } from 'mobx-react-lite';
import { Spinner } from '@heroui/react';

// 라우트 객체를 생성하기 위한 헬퍼 함수
const generateRouteObject = (routeBuilder: IRouteBuilder): RouteObject => ({
  path: routeBuilder?.pathname,
  element: <RouteBuilder key={v4()} routeBuilder={routeBuilder} />,
  errorElement: <div>오류가 발생했습니다</div>,
  children: routeBuilder?.children?.map(generateRouteObject),
});

// ILLIT 전역 인스턴스를 직접 사용하여 useApp 훅 대신 사용
// MobX 저장소의 변화에 반응하기 위해 observer로 래핑
export const App = observer(() => {
  // ILLIT이 초기화되지 않았거나 routeBuilders가 없는 경우 로딩 스피너 표시
  if (!ILLIT?.isInitialized || !ILLIT?.navigation?.routeBuilders?.length) {
    console.log('ILLIT 초기화 상태:', ILLIT?.isInitialized);
    console.log(
      'routeBuilders 길이:',
      ILLIT?.navigation?.routeBuilders?.length,
    );
    return <Spinner label="앱을 로딩 중입니다..." />;
  }

  // 라우터 생성
  const router = createBrowserRouter(
    ILLIT.navigation.routeBuilders.map(generateRouteObject),
  );

  console.log(
    '앱이 라우트와 함께 초기화됨:',
    router,
    ILLIT.navigation.routeBuilders.length,
  );

  return <RouterProvider router={router} />;
});
