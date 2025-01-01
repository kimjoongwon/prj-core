import { ReactNode, useEffect } from 'react';
import {
  AppBar,
  Button,
  HStack,
  Layout,
  List,
  Tabs,
  VStack,
} from '@shared/frontend';
import { Outlet, useNavigate } from 'react-router-dom';
import { useStore } from '@shared/stores';
import { LayoutBuilder as LayoutBuilderInterface } from '@shared/types';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { action, reaction } from 'mobx';
import { v4 } from 'uuid';
import { PathUtil } from '@shared/utils';
import {
  Card,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
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
    return <FormLayout layoutBuilder={layoutBuilder}>{children}</FormLayout>;
  }

  if (layoutBuilder?.type === 'Detail') {
    return (
      <DetailLayout layoutBuilder={layoutBuilder}>{children}</DetailLayout>
    );
  }

  if (layoutBuilder?.type === 'Tab') {
    return <TabLayout layoutBuilder={layoutBuilder}>{children}</TabLayout>;
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
  const store = useStore();
  const navigate = useNavigate();

  return (
    <>
      <div className="flex flex-col md:flex-row h-full flex-1 space-y-2 md:space-y-0 md:space-x-2">
        <Card className="rounded-xl p-2 w-full md:w-[200px]">
          <List
            className="flex flex-row md:flex-col"
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
        </Card>
        {children}
      </div>
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

export const DetailLayout = observer((props: DetailLayoutProps) => {
  const { children } = props;
  const navigate = useNavigate();

  return (
    <Modal size="5xl" isOpen={true} isDismissable onClose={() => navigate(-1)}>
      <ModalContent>
        <ModalHeader>
          {`${props.layoutBuilder?.page?.name}  ${props.layoutBuilder?.name}`}
        </ModalHeader>
        <ModalBody>
          {children}
          <Outlet />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
});

export const TabLayout = observer((props: TabLayoutProps) => {
  const { layoutBuilder, children } = props;
  const state = useLocalObservable(() => ({
    currentPath: '',
  }));
  const navigate = useNavigate();

  useEffect(() => {
    const disposer = reaction(
      () => state.currentPath,
      () => {
        navigate(state.currentPath);
      },
    );

    return disposer;
  }, []);

  return (
    <>
      <Tabs
        state={state}
        options={layoutBuilder?.pathOptions || []}
        path="currentPath"
      />
      <Outlet />
      {children}
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
    <Modal size="5xl" isOpen={true} isDismissable onClose={() => navigate(-1)}>
      <ModalContent>
        <ModalHeader>
          {`${props.layoutBuilder?.page?.name}  ${props.layoutBuilder?.name}`}
        </ModalHeader>
        <ModalBody>
          {children}
          <Outlet />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
});

export const ServiceNavigator = observer(() => {
  return <ServicesRoutes />;
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
type DetailLayoutProps = Layout;
type TabLayoutProps = Layout;
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
