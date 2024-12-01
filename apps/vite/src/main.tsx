import ReactDOM from 'react-dom/client';
import { ReactQueryProvider } from '@shared/frontend';
import {
  createBrowserRouter,
  RouteObject,
  RouterProvider,
} from 'react-router-dom';
import { observable } from 'mobx';
import { PageBuilder } from './builders/PageBuilder';
import { LayoutBuilder } from './builders/LayoutBuilder';
import { observer } from 'mobx-react-lite';
import { NextUIProvider } from '@nextui-org/react';
import './index.css';
import { Providers } from './providers';
import { useStore } from '@shared/stores';

const rootElement = document.getElementById('root')!;

export const store = observable({
  snackbar: {
    open: false,
    message: '',
  },
});

// eslint-disable-next-line react-refresh/only-export-components
const App = observer(() => {
  const illitStore = useStore();

  const routerDomRoutes = illitStore.appBuilder.routes?.map(rawRoute => {
    const route: RouteObject = {
      path: rawRoute.pathname,
      element: <PageBuilder state={rawRoute.layout.page} />,
    } as RouteObject;

    return route as RouteObject;
  });

  const routerDomRootRoute: RouteObject = {
    path: '/',
    element: <LayoutBuilder />,
    children: routerDomRoutes,
  };

  if (routerDomRoutes.length === 0) {
    return <></>;
  }

  let router = undefined;
  if (!router) {
    router = createBrowserRouter([routerDomRootRoute]);
  }

  return <RouterProvider router={router} />;
});

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <ReactQueryProvider>
      <NextUIProvider>
        <Providers>
          <App />
        </Providers>
      </NextUIProvider>
    </ReactQueryProvider>,
  );
}
