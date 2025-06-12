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
  errorElement: <div>오류가 발생했습니다</div>,
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
  ];

  const router = createBrowserRouter(routes);

  return <RouterProvider router={router} />;
});
