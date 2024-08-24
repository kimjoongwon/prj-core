'use client';

import { Avatar, Button, galaxy, Navbar, NavbarItem } from '@shared/frontend';
import { observer } from 'mobx-react-lite';
import { usePathname } from 'next/navigation';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = observer((props: MainLayoutProps) => {
  const pathnname = usePathname();
  const { children } = props;

  const onClickLeave = () => {
    galaxy.auth.logout();
    galaxy.router.replace({
      url: '/admin/auth/login',
    });
  };

  const navbarItems: NavbarItem[] = [
    {
      name: '서비스 관리',
      url: '/admin/main/services',
      onClick: () => {
        galaxy.router.push({
          url: '/admin/main/services',
        });
      },
    },
    {
      name: '매장 관리',
      url: '/admin/main/services/:serviceId',
    },
    {
      name: '문의 관리',
      url: '/admin/main/services/:serviceId',
    },
    {
      name: '설정',
      url: '/admin/main/services/:serviceId',
    },
  ];

  return (
    <Navbar
      navbarItems={navbarItems}
      rightContents={
        <>
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
