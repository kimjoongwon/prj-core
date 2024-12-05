import { AppBar, Button, HStack, List, VStack } from '@shared/frontend';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@shared/stores';
import { LayoutBuilder as LayoutBuilderState } from '@shared/types';
import { observer } from 'mobx-react-lite';
import React, { ReactNode } from 'react';
import { v4 } from 'uuid';
import { action } from 'mobx';

export const LayoutBuilder = observer((props: LayoutBuilderProps) => {
  const { children, state } = props;

  if (state?.type === 'Auth') {
    return <AuthLayout>{children}</AuthLayout>;
  }

  if (state?.type === 'Main') {
    return <MainLayout>{children}</MainLayout>;
  }

  if (state?.type === 'Root') {
    return <RootLayout>{children}</RootLayout>;
  }

  if (state?.type === 'Admin') {
    return <AdminLayout>{children}</AdminLayout>;
  }

  if (state?.type === 'Services') {
    return <ServicesLayout>{children}</ServicesLayout>;
  }

  if (state?.type === 'Service') {
    return <ServiceLayout>{children}</ServiceLayout>;
  }

  return children;
});

export const RootLayout = observer((props: RootLayoutProps) => {
  const { children } = props;
  return <VStack className="w-full h-screen">{children}</VStack>;
});

export const AdminLayout = observer((props: AdminLayoutProps) => {
  const { children } = props;

  return <>{children}</>;
});

export const AuthLayout = observer((props: AuthLayoutProps) => {
  const { children } = props;
  return (
    <>
      <AppBar />
      {children}
    </>
  );
});

export const ServiceLayout = observer((props: ServiceLayoutProps) => {
  const { children } = props;

  return (
    <>
      <Sidebar />
      {children}
    </>
  );
});

export const ServicesLayout = observer((props: ServicesLayoutProps) => {
  const { children } = props;

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
});

export const MainLayout = observer((props: MainLayoutProps) => {
  const { children } = props;
  return <>{children}</>;
});

export const ServiceNavigator = observer(() => {
  return <ServicesRoutes />;
});

export const ServiceRoutes = observer(() => {
  const store = useStore();
  const navigate = useNavigate();
  return (
    <List
      className="flex-1"
      data={store.navigation.serviceRoute?.children || []}
      renderItem={route => {
        return (
          <Button
            variant="light"
            key={v4()}
            color={route.active ? 'primary' : 'default'}
            onClick={() => {
              navigate(route.pathname);
              store.navigation.activateRoute();
            }}
          >
            {route.name}
          </Button>
        );
      }}
    />
  );
});

export const ServicesRoutes = observer(() => {
  const { navigation } = useStore();
  const navigate = useNavigate();
  return (
    <HStack className="justify-center">
      {navigation.servicesRoute?.children?.map(route => {
        return (
          <Button
            variant="light"
            color={route.active ? 'primary' : 'default'}
            onClick={action(() => {
              navigate(route.pathname);
              navigation.activateRoute();
            })}
          >
            {route.name}
          </Button>
        );
      })}
    </HStack>
  );
});

export const Sidebar = () => {
  return (
    <VStack className="flex-1 border-r-1 w-52">
      <ServiceRoutes />
    </VStack>
  );
};

export const Header = () => {
  return <AppBar content={<ServicesRoutes />} />;
};

export const Footer = () => {
  return (
    <div className="w-full border-t-1 flex h-[60px] justify-center items-center">
      <ServiceNavigator />
    </div>
  );
};

interface RootLayoutProps {
  children: ReactNode;
}

interface LayoutBuilderProps {
  state: LayoutBuilderState | undefined;
  children: React.ReactNode;
}

interface AuthLayoutProps {
  children: ReactNode;
}

interface AdminLayoutProps {
  children: ReactNode;
}

interface ServiceLayoutProps {
  children: ReactNode;
}

interface ServicesLayoutProps {
  children: ReactNode;
}

interface MainLayoutProps {
  children: ReactNode;
}
