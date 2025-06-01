import {
  createBrowserRouter,
  RouterProvider,
  type RouteObject,
} from 'react-router';
import { type RouteBuilder as IRouteBuilder } from '@shared/specs';
import { DarkModeSwitch, Plate, RouteBuilder } from '@shared/frontend';
import { observer } from 'mobx-react-lite';
import { Spinner } from '@heroui/react';
// Any configurations are optional

// 라우트 객체를 생성하기 위한 헬퍼 함수
const generateRouteObject = (routeBuilder: IRouteBuilder): RouteObject => ({
  path: routeBuilder?.pathname,
  Component: () => <RouteBuilder routeBuilder={routeBuilder} />,
  errorElement: <div>오류가 발생했습니다</div>,
  children: routeBuilder?.children?.map(generateRouteObject),
});

// Plate 전역 인스턴스를 직접 사용하여 useApp 훅 대신 사용
// MobX 저장소의 변화에 반응하기 위해 observer로 래핑
export const App = observer(() => {
  // Plate이 초기화되지 않았거나 routeBuilders가 없는 경우 로딩 스피너 표시
  if (!Plate?.isInitialized || !Plate?.navigation?.routeBuilders?.length) {
    return <Spinner label="앱을 로딩 중입니다..." />;
  }

  // 라우터 생성
  const router = createBrowserRouter(
    Plate.navigation.routeBuilders.map(generateRouteObject),
  );

  console.log(
    '앱이 라우트와 함께 초기화됨:',
    router,
    Plate.navigation.routeBuilders.length,
  );

  return (
    <>
      <RouterProvider router={router} />
      <DarkModeSwitch position="top-right" />
    </>
  );
});
