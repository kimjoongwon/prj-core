import {
  createBrowserRouter,
  RouterProvider,
  type RouteObject,
  Outlet,
  Navigate,
} from 'react-router';
import { type RouteBuilder as IRouteBuilder } from '@shared/types';
import {
  Plate,
  RouteBuilder,
  NavigationSetup,
  useAuth,
  NotFound,
} from '@shared/frontend';
import { observer } from 'mobx-react-lite';

const AppLayout = () => {
  return (
    <>
      <NavigationSetup />
      <Outlet />
    </>
  );
};

const generateRouteObject = (routeBuilder: IRouteBuilder): RouteObject => ({
  path: routeBuilder?.relativePath,
  Component: () => <RouteBuilder routeBuilder={routeBuilder} />,
  errorElement: (
    <NotFound
      title="오류가 발생했습니다"
      description="페이지를 로드하는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요."
      homePath="/admin/dashboard"
      homeButtonText="대시보드로 돌아가기"
    />
  ),
  children: routeBuilder?.children?.map(generateRouteObject),
});

export const App = observer(() => {
  const { isAuthenticated } = useAuth();

  // Plate이 초기화되지 않았으면 로딩
  if (!Plate?.isInitialized) {
    return <div>앱 초기화 중...</div>;
  }

  // 인증 상태에 따른 기본 리다이렉트 설정
  const redirectElement = isAuthenticated ? (
    <Navigate to="/admin/dashboard" replace />
  ) : (
    <Navigate to="/admin/auth/login" replace />
  );

  // 모든 라우트를 포함한 라우터 설정
  const routes: RouteObject[] = [
    {
      path: '/',
      Component: AppLayout,
      children: [
        {
          index: true,
          element: redirectElement,
        },
        ...Plate.navigation.routeBuilders.map(generateRouteObject),
      ],
    },
    // Catch-all route for 404 Not Found
    {
      path: '*',
      element: (
        <NotFound
          title="페이지를 찾을 수 없습니다"
          description="요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다."
          homePath="/admin/dashboard"
          homeButtonText="대시보드로 돌아가기"
        />
      ),
    },
  ];

  const router = createBrowserRouter(routes);

  return <RouterProvider router={router} />;
});
