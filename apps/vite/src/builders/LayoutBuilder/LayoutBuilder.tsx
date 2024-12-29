import { ReactNode } from 'react';
import { AppBar, Button, HStack, List, Text, VStack } from '@shared/frontend';
import { Outlet, useNavigate } from 'react-router-dom';
import { useStore } from '@shared/stores';
import { LayoutBuilder as LayoutBuilderInterface } from '@shared/types';
import { observer } from 'mobx-react-lite';
import { action } from 'mobx';
import { v4 } from 'uuid';
import { PathUtil } from '@shared/utils';
import {
  Card,
  Modal,
  ModalBody,
  ModalContent,
  Tab,
  Tabs,
} from '@nextui-org/react';

export const LayoutBuilder = observer((props: LayoutBuilderProps) => {
  const { children, layoutBuilder } = props;

  if (layoutBuilder?.type === 'Root') {
    return <RootLayout>{children}</RootLayout>;
  }

  if (layoutBuilder?.type === 'Admin') {
    return <AdminLayout>{children}</AdminLayout>;
  }

  if (layoutBuilder?.type === 'Auth') {
    return <AuthLayout>{children}</AuthLayout>;
  }

  if (layoutBuilder?.type === 'Main') {
    return <MainLayout>{children}</MainLayout>;
  }

  if (layoutBuilder?.type === 'Services') {
    return <ServicesLayout>{children}</ServicesLayout>;
  }

  if (layoutBuilder?.type === 'Service') {
    return <ServiceLayout>{children}</ServiceLayout>;
  }

  if (layoutBuilder?.type === 'Master') {
    return <MasterLayout>{children}</MasterLayout>;
  }

  if (layoutBuilder?.type === 'Form') {
    return <FormLayout>{children}</FormLayout>;
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
      <HStack className="h-full flex-1">
        <Sidebar />
        {children}
      </HStack>
    </>
  );
});

export const ServicesLayout = observer((props: ServicesLayoutProps) => {
  const { children } = props;

  return (
    <VStack className="flex-1 space-y-2">
      <Header />
      {children}
      <Footer />
    </VStack>
  );
});

export const MasterLayout = observer((props: MasterLayoutProps) => {
  const { children } = props;

  return (
    <Card className="w-full rounded-xl p-2 rounded-b-none space-y-2">
      {children}
      <Outlet />
    </Card>
  );
});

export const DetailLayout = observer((props: TableLayoutProps) => {
  const { children } = props;

  return (
    <>
      <Text>Detail Layout</Text>
      {children}
      <Outlet />
    </>
  );
});

export const MainLayout = observer((props: MainLayoutProps) => {
  const { children } = props;
  return children;
});

export const FormLayout = observer((props: FormLayoutProps) => {
  const { children } = props;
  const navigate = useNavigate();

  return (
    <Modal isOpen={true} isDismissable onClose={() => navigate(-1)}>
      <ModalContent>
        <ModalBody>{children}</ModalBody>
      </ModalContent>
    </Modal>
  );
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
            onPress={() => {
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
            key={route.pathname}
            variant="light"
            color={route.active ? 'primary' : 'default'}
            onPress={action(() => {
              navigate(
                PathUtil.getUrlWithParamsAndQueryString(
                  route.pathname,
                  route.params,
                ),
              );
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
    <VStack className="border-1 rounded-b-none min-w-[200px] hidden sm:flex rounded-xl shadow-xl mr-2 p-2">
      <ServiceRoutes />
    </VStack>
  );
};

export const Header = () => {
  return <AppBar content={<ServicesRoutes />} />;
};

export const Footer = () => {
  return (
    <Card className="relative bottom-0 w-full flex sm:hidden h-[64px] justify-center items-center rounded-t-none rounded-b-none">
      <ServicesRoutes />
    </Card>
  );
};

interface Layout {
  children: ReactNode;
  layoutBuilder?: LayoutBuilderInterface;
}

type RootLayoutProps = Layout;
type LayoutBuilderProps = Layout;
type FormLayoutProps = Layout;
type MasterLayoutProps = Layout;

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

interface TableLayoutProps {
  children: ReactNode;
  layoutBuilder: LayoutBuilderInterface;
}
