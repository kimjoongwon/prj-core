'use client';

import {
  ADMIN_MAIN_PATH,
  AdminMainLayout,
  Avatar,
  Button,
  HStack,
  Navbar,
  Select,
  Sidebar,
  Skeleton,
  myUniv,
  useApp,
  useGetAccessibleAllSpaceSuspense,
} from '@shared/frontend';
import { observer } from 'mobx-react-lite';
import { usePathname } from 'next/navigation';
import { useMeta } from './_hooks';
import { Suspense } from 'react';
import { isServer } from '@tanstack/react-query';
import { isEmpty } from 'lodash-es';
import { AuthStatus } from '@shared/frontend/src/domains/auth';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = (props: MainLayoutProps) => {
  const { children } = props;
  const { topNavItems, sidebarNavItems } = useMeta();
  const pathname = usePathname();
  const app = useApp();

  const onClickLeave = () => {
    app.auth.logout();

    app.router.replace({
      url: '/admin/auth/login',
    });
  };

  console.log('auth.currentSpaceId');

  if (app.auth.status != AuthStatus.Authenticated) return <div>loading..</div>;

  return (
    <>
      <Navbar
        rightContents={
          <>
            <Suspense fallback={<Skeleton />}>
              <AccessibleSpaceSelect />
            </Suspense>
            <Avatar name={app.auth.user?.email || 'test!'} />
            <Button onClick={onClickLeave} color="danger" variant="flat">
              나가기
            </Button>
          </>
        }
        navItems={topNavItems}
      />
      <HStack className="container h-full">
        {pathname !== ADMIN_MAIN_PATH && <Sidebar navItems={sidebarNavItems} />}
        <AdminMainLayout>{children}</AdminMainLayout>
      </HStack>
    </>
  );
};

const AccessibleSpaceSelect = observer(() => {
  const { data: queryData } = useGetAccessibleAllSpaceSuspense();

  const spaceOptions = queryData?.data?.map(space => ({
    text: space.name,
    value: space.id,
  }));

  return (
    <Select
      className="w-40"
      options={spaceOptions}
      state={myUniv.auth}
      path="currentSpaceId"
    />
  );
});

export default observer(MainLayout);
