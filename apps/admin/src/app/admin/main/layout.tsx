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
  authStore,
  router,
  useGetAccessibleAllSpace,
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
  const { data: queryData } = useGetAccessibleAllSpace();

  const spaceOptions = queryData?.data?.map(space => ({
    text: space.name,
    value: space.id,
  }));

  const onClickLeave = () => {
    router.replace({
      url: '/admin/auth/login',
    });
  };

  return (
    <>
      <Navbar
        rightContents={
          <>
            <Select
              className="w-40"
              options={spaceOptions}
              state={authStore}
              path="currentSpaceId"
            />
            <Avatar name={authStore.user?.email || 'test!'} />
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

export default observer(MainLayout);
