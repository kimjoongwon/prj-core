'use client';

import { AppBar, BottomTab, Spacer, VStack } from '@shared/frontend';
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
      <Spacer y={10} />
      <BottomTab tabs={routes} />
    </>
  );
};

export default MainLayout;
