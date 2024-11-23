import ReactDOM from 'react-dom/client';
import {
  APIManager,
  AppBar,
  BottomTab,
  ComponentManager,
  HStack,
  ReactQueryProvider,
  useGetPages,
  VStack,
} from '@shared/frontend';
import {
  createBrowserRouter,
  Outlet,
  RouteObject,
  RouterProvider,
  useLocation,
} from 'react-router-dom';
import './index.css';
import { useEffect, useState } from 'react';
import { Page } from './Page';
import { ToastContainer } from 'react-toastify';
import { State } from '@shared/types';
import { Alert, Snackbar } from '@mui/material';
import { observable } from 'mobx';
import { observer } from 'mobx-react-lite';
import 'react-toastify/dist/ReactToastify.css';

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

  const routes: RouteObject[] = pages?.map(page => {
    const route: RouteObject = {
      path: page.pathname,
      element: <Page state={page} />,
    };

    return route;
  });

  const _route: RouteObject = {
    path: '/',
    element: <Layout />,
    children: routes,
  };

  if (routes?.length <= 1) {
    return <></>;
  }

  let router = undefined;
  if (!router) {
    router = createBrowserRouter([_route]);
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

export const Layout = () => {
  const location = useLocation();
  const { data: getPagesResponse } = useGetPages();
  const pages = (getPagesResponse?.data || []) as unknown as State[];

  const page = pages?.find(page => page.pathname === location.pathname);

  const layout = page?.layout;

  return (
    <VStack className="w-full">
      {layout?.top && <AppBar />}
      <HStack>
        {layout?.left && <Left />}
        <VStack className="w-full">
          <Outlet />
          {layout?.bottom && <Footer state={page!} />}
        </VStack>
        {layout?.right && <Right />}
      </HStack>
    </VStack>
  );
};
export const Top = () => {
  return <div>top</div>;
};

export const Right = () => {
  return <div>right</div>;
};

export const Left = () => {
  return <div>left</div>;
};

interface LayoutProps {
  state: State;
}

export const Footer = (props: LayoutProps) => {
  const { state } = props;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const Component = ComponentManager[state.layout?.bottom?.component.type];
  return <Component {...state.layout?.bottom?.component.props} />;
};
