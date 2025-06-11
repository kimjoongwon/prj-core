import {
  createBrowserRouter,
  RouterProvider,
  type RouteObject,
  Outlet,
} from 'react-router';
import { type RouteBuilder as IRouteBuilder } from '@shared/types';
import { Plate, RouteBuilder, NavigationSetup } from '@shared/frontend';
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
  const router = createBrowserRouter([
    {
      path: '/',
      Component: AppLayout,
      children: Plate.navigation.routeBuilders.map(generateRouteObject),
    },
  ]);

  return <RouterProvider router={router} />;
});
