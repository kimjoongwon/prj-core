import { Container } from '@mui/material';
import { AppBar, BottomTab, Button, HStack, VStack } from '@shared/frontend';
import { observer } from 'mobx-react-lite';
import { Outlet, useNavigate } from 'react-router-dom';
import { useStore } from '@shared/stores';

export const LayoutBuilder = () => {
  return <Main />;
};

export const Main = observer(() => {
  const navigate = useNavigate();
  const store = useStore();

  return (
    <VStack className="w-full h-screen">
      <AppBar>
        <div className="flex flex-row space-x-2">
          {store.navigation.mainServiceRoutes?.map(route => {
            return (
              <Button
                className="font-medium"
                variant="light"
                key={route.pathname}
                color={route.active ? 'primary' : 'default'}
                onClick={() => {
                  store.navigation.setActiveRoute(route);
                  navigate(route.pathname);
                }}
              >
                {route.name}
              </Button>
            );
          })}
        </div>
      </AppBar>
      <HStack className="flex-1 h-full">
        {store.navigation.serviceItemRoutes.map(route => {
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
        })}
        <Container>
          <Outlet />
        </Container>
        <Footer />
      </HStack>
    </VStack>
  );
});

export const Top = observer(() => {
  return <AppBar>{/* <MainServiceNavBar /> */}</AppBar>;
});

export const Footer = observer(() => {
  return (
    <div className="md:hidden flex">
      <BottomTab>{/* <MainServiceNavBar /> */}</BottomTab>
    </div>
  );
});

export const Left = observer(() => {
  return <div className="hidden md:flex">{/* <ServiceItemListBox /> */}</div>;
});
