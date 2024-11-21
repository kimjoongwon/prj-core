import ReactDOM from 'react-dom/client';
import { APIManager, ReactQueryProvider } from '@shared/frontend';
import {
  createBrowserRouter,
  Outlet,
  RouteObject,
  RouterProvider,
} from 'react-router-dom';
import './index.css';
import { useEffect, useMemo, useState } from 'react';
import { Page } from './Page';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { State } from '@shared/types';
import { Alert, Snackbar } from '@mui/material';
import { observable } from 'mobx';
import { observer } from 'mobx-react-lite';
import { element } from 'effect/Schema';
import { AdminPage } from './AdminPage';

const rootElement = document.getElementById('root')!;

export const store = observable({
  snackbar: {
    open: false,
    message: '',
  },
});

// eslint-disable-next-line react-refresh/only-export-components
const App = () => {
  const [pages, setPages] = useState<State[]>([]);

  useEffect(() => {
    const _getPages = async () => {
      if (pages?.length === 0) {
        const { data: pages } = await APIManager.getPages();
        const _pages = pages as unknown as State[];
        setPages(_pages);
      }
    };

    _getPages();
  }, [pages.length]);

  const routes: RouteObject[] = useMemo(
    () =>
      pages?.map(page => {
        const route: RouteObject = {
          path: page.pathname,
          element: <Page state={page} />,
          exact: true,
        };

        return route;
      }),

    [pages],
  );

  const adminRoute = {
    path: 'admin',
    element: <AdminPage />,
  };

  const rootRoute = {
    path: '/',
    element: (
      <div>
        <Outlet />
      </div>
    ),
    index: true,
  };

  routes.push(rootRoute);
  routes.push(adminRoute);

  if (routes?.length <= 3) {
    return <></>;
  }

  let router = undefined;
  if (!router) {
    router = createBrowserRouter(routes);
  }

  return <RouterProvider router={router} />;
};

export const GalaxySnackBar = observer(() => {
  return (
    <Snackbar
      open={store.snackbar.open}
      autoHideDuration={6000}
      onClose={() => (store.snackbar.open = false)}
    >
      <Alert
        onClose={() => (store.snackbar.open = false)}
        severity="success"
        variant="outlined"
        sx={{ width: '100%' }}
      >
        {store.snackbar.message}
      </Alert>
    </Snackbar>
  );
});

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <ReactQueryProvider>
      <App />
      <ToastContainer />
      <GalaxySnackBar />
    </ReactQueryProvider>,
  );
}
