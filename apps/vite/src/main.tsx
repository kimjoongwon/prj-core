import ReactDOM from 'react-dom/client';
import { APIManager, ReactQueryProvider } from '@shared/frontend';
import {
  createBrowserRouter,
  Outlet,
  RouteObject,
  // RouteObject,
  RouterProvider,
} from 'react-router-dom';
// import { APIManager } from '@shared/frontend';
// import { IPage, Page } from './Page';
import './index.css';
import { useEffect, useMemo, useState } from 'react';
import { IPage, Page } from './Page';

const rootElement = document.getElementById('root')!;

const App = () => {
  const [pages, setPages] = useState<IPage[]>([]);

  useEffect(() => {
    const _getPages = async () => {
      if (pages?.length === 0) {
        const { data: pages } = await APIManager.getPages();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        setPages(pages);
      }
    };

    _getPages();
  }, [pages.length]);

  const routes: RouteObject[] = useMemo(
    () =>
      pages?.map(page => {
        const renderPage = (page: IPage): RouteObject => {
          return {
            path: page.pathname,
            element: <Page page={page} />,
            children: page.children?.map(renderPage),
          };
        };

        const route: RouteObject = {
          path: page.pathname,
          element: <Page page={page} />,
        };

        if (page.children) {
          route.children = page.children.map(renderPage);
        }

        return route;
      }),
    [pages.length],
  );

  if (routes.length === 0) {
    return <></>;
  }

  let router = undefined;
  if (!router) {
    router = createBrowserRouter(routes);
  }

  console.log('routes', routes);

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
