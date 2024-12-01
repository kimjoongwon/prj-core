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
  const illitStore = useStore();

  return (
    <VStack className="w-full h-screen">
      <AppBar>
        <div className="flex flex-row space-x-2">
          {illitStore.navigation.navItems?.map(navItem => {
            return (
              <Button
                key={navItem.pathname}
                href={navItem.pathname}
                onClick={() => {
                  navigate(navItem.pathname);
                }}
              >
                {navItem.name}
              </Button>
            );
          })}
        </div>
      </AppBar>
      <HStack className="flex-1 h-full">
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
