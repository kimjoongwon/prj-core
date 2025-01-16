import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouteObject,
  RouterProvider,
} from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStore } from '@shared/stores';
import { Providers } from './Providers';
import { RouteBuilder as IRouteBuilder } from '@shared/types';
import { RouteBuilder } from './builders/Route/RouteBuilder';
import { ReactQueryProvider } from '@shared/frontend';
import { v4 } from 'uuid';
import './index.css';
import { Spinner } from '@nextui-org/react';

const rootElement = document.getElementById('root')!;

const generateRouteObject = (routeBuilder: IRouteBuilder): RouteObject => ({
  path: routeBuilder?.pathname,
  element: <RouteBuilder key={v4()} routeBuilder={routeBuilder} />,
  errorElement: <div>error</div>,
  children: routeBuilder?.children?.map(generateRouteObject),
});

const App = observer(() => {
  const { navigation, isInitialized } = useStore();
  const router = createBrowserRouter(
    navigation.routeBuilders?.map(generateRouteObject),
  );

  return !isInitialized ? <Spinner /> : <RouterProvider router={router} />;
});

if (!rootElement.innerHTML) {
  ReactDOM.createRoot(rootElement).render(
    <ReactQueryProvider>
      <Providers>
        <App />
      </Providers>
    </ReactQueryProvider>,
  );
}
