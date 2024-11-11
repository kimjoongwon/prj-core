import ReactDOM from 'react-dom/client';
import { APIManager, ReactQueryProvider } from '@shared/frontend';
import {
  createBrowserRouter,
  RouteObject,
  RouterProvider,
} from 'react-router-dom';
import './index.css';
import { useEffect, useMemo, useState } from 'react';
import { Page } from './Page';
import { IPage } from '@shared/types';

const rootElement = document.getElementById('root')!;

// eslint-disable-next-line react-refresh/only-export-components
const App = () => {
  const [pages, setPages] = useState<IPage[]>([]);

  useEffect(() => {
    const _getPages = async () => {
      if (pages?.length === 0) {
        const { data: pages } = await APIManager.getPages();
        const _pages = pages as unknown as IPage[];
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
          element: <Page page={page} />,
        };

        return route;
      }),
    [pages],
  );

  if (routes.length === 0) {
    return <></>;
  }

  let router = undefined;
  if (!router) {
    router = createBrowserRouter(routes);
  }

  return <RouterProvider router={router} />;
};

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <ReactQueryProvider>
      <App />
    </ReactQueryProvider>,
  );
}
