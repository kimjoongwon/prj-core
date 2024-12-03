import { Container } from '@mui/material';
import { AppBar, BottomTab, Button, HStack, VStack } from '@shared/frontend';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@shared/stores';
import { LayoutBuilder as LayoutBuilderState, Route } from '@shared/types';
import { observer } from 'mobx-react-lite';
import { ReactNode } from 'react';

interface LayoutBuilderProps {
  state: LayoutBuilderState | undefined;
  children: React.ReactNode;
}

export const LayoutBuilder = observer((props: LayoutBuilderProps) => {
  const { children, state } = props;

  if (state?.type === 'Auth') {
    return <AuthLayout>{children}</AuthLayout>;
  }

  if (state?.type === 'Main') {
    return <MainLayout>{children}</MainLayout>;
  }

  return children;
});

interface RootLayoutProps {
  children: ReactNode;
}

export const RootLayout = observer((props: RootLayoutProps) => {
  const { children } = props;
  return <VStack className="w-full h-screen">{children}</VStack>;
});

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout = observer((props: AuthLayoutProps) => {
  return (
    <RootLayout>
      <AppBar />
      {props.children}
    </RootLayout>
  );
});

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = observer((props: MainLayoutProps) => {
  const { children } = props;
  const navigate = useNavigate();
  const store = useStore();
  console.log('routes', store.navigation.routes);
  console.log('servicesRoute', store.navigation.servicesRoute);
  return (
    <RootLayout>
      <AppBar
        content={
          <AppBarContent
            routes={store.navigation.servicesRoute?.children || []}
          />
        }
      />
      <HStack className="flex-1 h-full">
        {/* {store.navigation.serviceItemRoutes.map(route => {
          return (
            <Button
              className="font-medium"
              variant="light"
              color={route.active ? 'primary' : 'default'}
              key={route.pathname}
              onClick={() => {
                store.navigation.setActiveRoute(route);
                navigate(route.pathname);
              }}
            >
              {route.name}
            </Button>
          );
        })} */}
        <Container>{children}</Container>
      </HStack>
      <BottomTab />
    </RootLayout>
  );
});

interface AppBarContentProps {
  routes: Route[];
}

export const AppBarContent = (props: AppBarContentProps) => {
  const { routes } = props;
  return routes.map(route => <Button>{route.name}</Button>);
};
