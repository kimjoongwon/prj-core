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
import { RouteBuilder } from './builders/Route/RouteBuilder';
import { ReactQueryProvider } from '@shared/frontend';
import { v4 } from 'uuid';
import './index.css';
import { Spinner } from '@nextui-org/react';

const rootElement = document.getElementById('root')!;

export const store = observable({
  snackbar: {
    open: false,
    message: '',
  },
});

const generateRouteObject = ({
  pathname,
  children,
}: IRouteBuilder): RouteObject => ({
  path: pathname,
  element: <RouteBuilder key={v4()} routeBuilder={{ pathname, children }} />,
  errorElement: <div>error</div>,
  children: children?.map(generateRouteObject),
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
