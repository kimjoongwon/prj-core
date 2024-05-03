'use client';

import {
  ADMIN_MAIN_PATH,
  Avatar,
  Button,
  HStack,
  Navbar,
  Sidebar,
  authStore,
} from '@shared/frontend';
import { observer } from 'mobx-react-lite';
import { usePathname } from 'next/navigation';
import { useMeta } from './_hooks';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = (props: MainLayoutProps) => {
  const { children } = props;
  const { topNavItems, sidebarNavItems } = useMeta();
  const pathname = usePathname();

  return (
    <>
      <Navbar
        rightContents={
          <>
            <Avatar name={authStore.user?.email || 'test!'} />
            <Button color="danger" variant="flat">
              나가기
            </Button>
          </>
        }
        navItems={topNavItems}
      />
      <HStack className="container h-full">
        {pathname !== ADMIN_MAIN_PATH && <Sidebar navItems={sidebarNavItems} />}
        {children}
      </HStack>
    </>
  );
};

export default observer(MainLayout);
