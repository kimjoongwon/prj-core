import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouteObject,
  RouterProvider,
} from 'react-router-dom';
import { observable } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useStore } from '@shared/stores';
import { Providers } from './Providers';
import { RouteBuilder as IRouteBuilder } from '@shared/types';
import { Route } from './builders/Route';
import { ReactQueryProvider } from '@shared/frontend';
import { v4 } from 'uuid';
import './index.css';

const rootElement = document.getElementById('root')!;

export const store = observable({
  snackbar: {
    open: false,
    message: '',
  },
});

// eslint-disable-next-line react-refresh/only-export-components
const App = observer(() => {
  const store = useStore();

  const routeObjects = store.navigation.routeBuilders?.map(routeBuilder => {
    const getRouteObjects = (routeBuilder: IRouteBuilder) => {
      const _route: RouteObject = {
        path: routeBuilder.pathname,
        element: <Route key={v4()} routeBuilder={routeBuilder} />,
        children: [],
        errorElement: <div>error</div>,
      };

      if (routeBuilder.children) {
        const children = routeBuilder.children.map(getRouteObjects);
        _route.children = children;
      }

      return _route;
    };

    const _route: RouteObject = {
      path: routeBuilder.pathname,
      element: <Route key={v4()} routeBuilder={routeBuilder} />,
      errorElement: <div>error</div>,
    };

    if (routeBuilder.children) {
      const children = routeBuilder.children.map(getRouteObjects);
      _route.children = children;
    }

    return _route;
  });

  const router = createBrowserRouter(routeObjects);

  if (!store.isInitialized) return <div>init...</div>;

  return <RouterProvider router={router} />;
});

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <ReactQueryProvider>
      <Providers>
        <App />
      </Providers>
    </ReactQueryProvider>,
  );
}
