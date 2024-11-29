import ReactDOM from 'react-dom/client';
import {
  APIManager,
  AppBar,
  BottomTab,
  HStack,
  ReactQueryProvider,
  Responsive,
  VStack,
} from '@shared/frontend';
import {
  createBrowserRouter,
  Outlet,
  RouteObject,
  RouterProvider,
} from 'react-router-dom';
import './index.css';
import { useEffect, useState } from 'react';
import { Page } from './Page';
import { ToastContainer } from 'react-toastify';
import { PageState } from '@shared/types';
import { Alert, Container, Snackbar, SpeedDial } from '@mui/material';
import { observable } from 'mobx';
import { observer } from 'mobx-react-lite';
import 'react-toastify/dist/ReactToastify.css';
import { MainServiceNavBar } from './widgets/MainServiceNavBar';
import { Menu } from 'lucide-react';
import { ServiceItemListBox } from './widgets/ServiceItemListBox';

const rootElement = document.getElementById('root')!;

export const store = observable({
  snackbar: {
    open: false,
    message: '',
  },
});

// eslint-disable-next-line react-refresh/only-export-components
const App = () => {
  const [pages, setPages] = useState<PageState[]>([]);

  useEffect(() => {
    const _getPages = async () => {
      if (pages?.length === 0) {
        const { data: pages } = await APIManager.getPages();
        const _pages = pages as unknown as PageState[];
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
  return <Main />;
};

export const Main = observer(() => {
  return (
    <VStack className="w-full">
      <Top />

      <HStack className="flex-1 h-full">
        <Left />
        <Container>
          <Outlet />
        </Container>
        <Footer />
        <Responsive>
          <SpeedDial
            open={true}
            ariaLabel="SpeedDial basic example"
            sx={{ position: 'absolute', bottom: 64, right: 16 }}
            icon={<Menu />}
          >
            <div>
              <ServiceItemListBox />
            </div>
          </SpeedDial>
        </Responsive>
      </HStack>
    </VStack>
  );
});

export const Top = observer(() => {
  return (
    <AppBar>
      <MainServiceNavBar />
    </AppBar>
  );
});

export const Footer = observer(() => {
  return (
    <div className="md:hidden flex">
      <BottomTab>
        <MainServiceNavBar />
      </BottomTab>
    </div>
  );
});

export const Left = observer(() => {
  return (
    <div className="hidden md:flex">
      <ServiceItemListBox />
    </div>
  );
});
