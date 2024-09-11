'use client';

import { Divider } from '@nextui-org/react';
import {
  Avatar,
  Button,
  galaxy,
  Navbar,
  NavbarItem,
  useGetAllServiceSuspense,
} from '@shared/frontend';
import { observer } from 'mobx-react-lite';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = observer((props: MainLayoutProps) => {
  const { children } = props;
  const getAllService = useGetAllServiceSuspense();
  const services = getAllService.data?.data;

  const onClickLeave = () => {
    galaxy.auth.logout();
    galaxy.router.replace({
      url: '/admin/auth/login',
    });
  };

  const navbarItems = services?.map(service => ({
    name: service.label,
    url: `/admin/main/services/${service.id}`,
    onClick: () => {
      galaxy.router.push({
        url: '/admin/main/services/:serviceId',
        params: {
          serviceId: service.id,
        },
      });
    },
  })) as NavbarItem[];

  const defaultNavItems: NavbarItem[] = [
    {
      name: '서비스 관리',
      url: '/admin/main/services',
      onClick: () => {
        galaxy.router.push({
          url: '/admin/main/services',
        });
      },
    },
  ];

  return (
    <>
      <Navbar
        navbarItems={[...defaultNavItems, ...navbarItems]}
        rightContents={
          <>
            <Avatar name={galaxy.auth.user?.name} />
            <Button onClick={onClickLeave} color="danger" variant="flat">
              나가기
            </Button>
          </>
        }
      />
      {children}
    </>
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
