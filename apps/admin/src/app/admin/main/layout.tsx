'use client';

import {
  Avatar,
  Button,
  galaxy,
  Navbar,
  NavbarItem,
  useGetAllServiceSuspense,
} from '@shared/frontend';
import { observer } from 'mobx-react-lite';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
interface MainLayoutProps {
  children: React.ReactNode;
}
// Step 1: Route 인터페이스 정의
interface Route {
  routeName: string;
  children?: Route[];
}

const routeNames = [
  { routeName: '앱 서비스', children: [{ routeName: '서비스 목록' }] },
  {
    routeName: '세션 서비스',
    children: [
      {
        routeName: '세션 관리',
        children: [{ routeName: '생성' }, { routeName: '수정' }],
      },
    ],
  },
  {
    routeName: '예약 서비스',
    children: [{ routeName: '예약 관리' }, { routeName: '문의 관리' }],
  },
  {
    routeName: '공간 서비스',
    children: [
      { routeName: '공간 관리' },
      { routeName: '그룹 관리' },
      { routeName: '카테고리 관리' },
      { routeName: '문의 관리' },
    ],
  },
  {
    routeName: '회원 서비스',
    children: [
      {
        routeName: '회원 관리',
        children: [{ routeName: '권한' }, { routeName: '상태' }],
      },
      {
        routeName: '그룹 관리',
        children: [{ routeName: '생성' }, { routeName: '수정' }],
      },
      {
        routeName: '카테고리 관리',
        children: [{ routeName: '생성' }, { routeName: '수정' }],
      },
    ],
  },
  {
    routeName: '권한 서비스',
    children: [
      {
        routeName: '권한 관리',
        children: [{ routeName: '생성' }, { routeName: '수정' }],
      },
      {
        routeName: '액션 관리',
        children: [{ routeName: '생성' }, { routeName: '수정' }],
      },
      {
        routeName: '주제 관리',
        children: [{ routeName: '생성' }, { routeName: '수정' }],
      },
      {
        routeName: '능력 관리',
        children: [{ routeName: '생성' }, { routeName: '수정' }],
      },
    ],
  },
];

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
      <BottomNavigation showLabels onChange={(event, newValue) => {}}>
        <BottomNavigationAction label="1" />
        <BottomNavigationAction label="2" />
        <BottomNavigationAction label="3" />
        <BottomNavigationAction label="4" />
        <BottomNavigationAction label="5" />
        <BottomNavigationAction label="" />
        <BottomNavigationAction label="" />
        <BottomNavigationAction label="" />
        <BottomNavigationAction label="" />
        <BottomNavigationAction label="" />
      </BottomNavigation>
    </>
  );
});

export default MainLayout;
