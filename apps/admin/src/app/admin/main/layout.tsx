'use client';

import {
  Avatar,
  Button,
  galaxy,
  Navbar,
  Select,
  Skeleton,
} from '@shared/frontend';
import { observer } from 'mobx-react-lite';
import { Suspense } from 'react';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = observer((props: MainLayoutProps) => {
  const { children } = props;

  const onClickLeave = () => {
    galaxy.auth.logout();
    galaxy.router.replace({
      url: '/admin/auth/login',
    });
  };

  return (
    <Navbar
      rightContents={
        <>
          {/* <Suspense fallback={<Skeleton />}>
            <AccessibleSpaceSelect />
          </Suspense> */}
          <Avatar name={galaxy.auth.user?.email || 'test!'} />
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

// const AccessibleSpaceSelect = observer(() => {
//   const spaceOptions = queryData?.data?.map(space => ({
//     text: space.name,
//     value: space.id,
//   }));

//   return <Select className="w-40" options={spaceOptions} state={galaxy.auth} />;
// });

export default MainLayout;
