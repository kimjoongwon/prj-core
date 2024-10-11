'use client';

import { AppBar, BottomTab, VStack } from '@shared/frontend';
import { useRoutes } from './_hooks/useRoutes';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = (props: MainLayoutProps) => {
  const { children } = props;
  const { routes } = useRoutes();

  return (
    <>
      <AppBar />
      <VStack className="flex-1 p-4">{children}</VStack>
      <BottomTab tabs={routes} />
    </>
  );
};

export default MainLayout;
