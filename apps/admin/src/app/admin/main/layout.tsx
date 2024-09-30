'use client';

import {
  AppBar,
  BottomTab,
  galaxy,
  Paths,
  useGetAllServiceSuspense,
} from '@shared/frontend';
import { url } from 'inspector';
import { observer } from 'mobx-react-lite';
import { useMeta } from './_hooks/useMeta';
interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = observer((props: MainLayoutProps) => {
  const { children } = props;
  const { navItems } = useMeta();

  console.log('-?');
  return (
    <>
      <AppBar />
      {children}
      <BottomTab tabs={navItems} />
    </>
  );
});

export default MainLayout;
