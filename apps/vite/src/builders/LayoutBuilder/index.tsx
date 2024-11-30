import { Container } from '@mui/material';
import { AppBar, BottomTab, HStack, VStack } from '@shared/frontend';
import { observer } from 'mobx-react-lite';
import { Outlet } from 'react-router-dom';

export const LayoutBuilder = () => {
  return <Main />;
};

export const Main = observer(() => {
  return (
    <VStack className="w-full h-screen">
      <Top />
      <HStack className="flex-1 h-full">
        <Left />
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
