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
import { ReactQueryProvider } from '@shared/frontend';
import { RouteBuilder } from './builders/RouteBuilder';
import { RouteBuilder as IRouteBuilder } from '@shared/types';
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

  const routes = store.navigation.routeBuilders?.map(routeBuilder => {
    const getRoute = (routeBuilder: IRouteBuilder) => {
      const _route: RouteObject = {
        path: routeBuilder.pathname,
        element: <RouteBuilder state={routeBuilder} />,
        children: [],
      };

      if (routeBuilder.children) {
        const children = routeBuilder.children.map(getRoute);
        _route.children = children;
      }

      return _route;
    };

    const _route: RouteObject = {
      path: routeBuilder.pathname,
      element: <RouteBuilder state={routeBuilder} />,
    };

    if (routeBuilder.children) {
      const children = routeBuilder.children.map(getRoute);
      _route.children = children;
    }

    return _route;
  });

  console.log('routes', routes);

  const router = createBrowserRouter(routes);
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
