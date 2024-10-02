'use client';

import { AppBar, BottomTab } from '@shared/frontend';
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
      {children}
      <BottomTab tabs={routes} />
    </>
  );
};

export default MainLayout;
