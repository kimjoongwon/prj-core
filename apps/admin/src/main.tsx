import { Button } from '@heroui/react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
  type RouteObject,
} from 'react-router';
import { observer } from 'mobx-react-lite';
import { type RouteBuilder as IRouteBuilder } from '@shared/types';
import { RouteBuilder, useApp } from '@shared/frontend';
import { v4 } from 'uuid';
import { Spinner } from '@heroui/react';
import { Providers } from './Providers';

const rootElement = document.getElementById('root')!;

const generateRouteObject = (routeBuilder: IRouteBuilder): RouteObject => ({
  path: routeBuilder?.pathname,
  element: <RouteBuilder key={v4()} routeBuilder={routeBuilder} />,
  errorElement: <div>error</div>,
  children: routeBuilder?.children?.map(generateRouteObject),
});

const App = observer(() => {
  const app = useApp();
  const navigation = app.navigation;
  const isInitialized = app.isInitialized;

  const router = createBrowserRouter(
    navigation.routeBuilders?.map(generateRouteObject),
  );

  return !isInitialized ? <Spinner /> : <RouterProvider router={router} />;
});

if (!rootElement.innerHTML) {
  ReactDOM.createRoot(rootElement).render(
    <Providers>
      <App />
    </Providers>,
  );
}
if (!rootElement.innerHTML) {
  ReactDOM.createRoot(rootElement).render(<Button>hgahah</Button>);
}
