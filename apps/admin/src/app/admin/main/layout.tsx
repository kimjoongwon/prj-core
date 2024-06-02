'use client';

import {
  Avatar,
  Button,
  Navbar,
  Select,
  Skeleton,
  myUniv,
  useApp,
  useGetAccessibleAllSpaceSuspense,
} from '@shared/frontend';
import { observer } from 'mobx-react-lite';
import { Suspense } from 'react';
import { AuthStatus } from '@shared/frontend/src/domains/auth';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = observer((props: MainLayoutProps) => {
  const { children } = props;
  // const app = useApp();

  const onClickLeave = () => {
    myUniv.auth.logout();

    myUniv.router.replace({
      url: '/admin/auth/login',
    });
  };

  if (myUniv.auth.status != AuthStatus.Authenticated)
    return <div>loading..</div>;

  return (
    <Navbar
      rightContents={
        <>
          <Suspense fallback={<Skeleton />}>
            <AccessibleSpaceSelect />
          </Suspense>
          <Avatar name={myUniv.auth.user?.email || 'test!'} />
          <Button onClick={onClickLeave} color="danger" variant="flat">
            나가기
          </Button>
        </>
      }
    >
      {children}
    </Navbar>
  );
});

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

export default MainLayout;
