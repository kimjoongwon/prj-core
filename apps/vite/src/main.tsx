import ReactDOM from 'react-dom/client';
import { ReactQueryProvider } from '@shared/frontend';
import {
  createBrowserRouter,
  // RouteObject,
  RouterProvider,
} from 'react-router-dom';
// import { APIManager } from '@shared/frontend';
// import { IPage, Page } from './Page';
import './index.css';

// const _getPages = async () => {
//   const { data: pages } = await APIManager.getPages();
//   return pages;
// };

// const pages = (await _getPages()) as unknown as IPage[];
// console.log('pages', pages);
// const routes: RouteObject[] = pages?.map(page => {
//   const renderPage = (page: IPage): RouteObject => {
//     return {
//       path: page.pathname,
//       element: <Page page={page} />,
//       children: page.children?.map(renderPage),
//     };
//   };

//   const route: RouteObject = {
//     path: page.pathname,
//     element: <Page page={page} />,
//   };

//   if (page.children) {
//     route.children = page.children.map(renderPage);
//   }

//   return route;
// });
// console.log('rotues', routes);
const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <div>hahah</div>,
    },
  ],
  {
    basename: '/admin',
  },
);

const rootElement = document.getElementById('root')!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <ReactQueryProvider>
      <RouterProvider router={router} />
    </ReactQueryProvider>,
  );
}
