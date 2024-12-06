import React, { ReactNode } from 'react';
import { AppBar, Button, HStack, VStack } from '@shared/frontend';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@shared/stores';
import { LayoutBuilder as LayoutBuilderState } from '@shared/types';
import { observer } from 'mobx-react-lite';
import { Paper } from '@mui/material';
import { Listbox, ListboxItem } from '@nextui-org/react';
import { action } from 'mobx';

interface LayoutBuilderProps {
  state: LayoutBuilderState | undefined;
  children: React.ReactNode;
}

export const Header = () => {
  return <AppBar content={<AppBarContent />} />;
};

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

interface AdminLayoutProps {
  children: ReactNode;
}

export const AdminLayout = observer((props: AdminLayoutProps) => {
  const { children } = props;

  return <>{children}</>;
});

export const AuthLayout = observer((props: AuthLayoutProps) => {
  return (
    <>
      <AppBar />
      {props.children}
    </>
  );
});

interface ServiceLayoutProps {
  children: ReactNode;
}

export const ServiceLayout = observer((props: ServiceLayoutProps) => {
  const { children } = props;

  return (
    <HStack>
      <ServiceRoutes />
      {children}
    </HStack>
  );
});

interface ServicesLayoutProps {
  children: ReactNode;
}

export const ServicesLayout = observer((props: ServicesLayoutProps) => {
  const { children } = props;

  return (
    <>
      <AppBar />
      {children}
      <ServicesNavigator />
    </>
  );
});

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = observer((props: MainLayoutProps) => {
  const { children } = props;
  return <>{children}</>;
});

export const AppBarContent = observer(() => {
  const store = useStore();
  const navigate = useNavigate();
  const servicesRoutes = store.navigation.servicesRoute.children;

  return (
    <div className="space-x-2">
      {servicesRoutes?.map(route => (
        <Button
          variant="light"
          color={route.active ? 'primary' : 'default'}
          onClick={() => {
            navigate(route.pathname);
          }}
        >
          {route.name}
        </Button>
      ))}
    </div>
  );
});

export const ServicesNavigator = observer(() => {
  return (
    <Paper
      elevation={3}
      sx={{
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: '60px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <ServicesRoutes />
    </Paper>
  );
});

export const ServiceRoutes = observer(() => {
  const store = useStore();

  return (
    <Listbox>
      {(store.navigation.serviceRoute?.children || [])?.map(route => {
        return <ListboxItem key={route.pathname}>{route.name}</ListboxItem>;
      })}
    </Listbox>
  );
});

export const ServicesRoutes = observer(() => {
  const { navigation } = useStore();
  const navigate = useNavigate();

  return (
    <HStack className="justify-center">
      {navigation.servicesRoute.children?.map(route => {
        return (
          <Button
            key={route.pathname}
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
