import { usePathname } from 'next/navigation';
import { ADMIN_RESERVATION_SERVICE_PATH } from '../../../constants/Paths';
import { NavbarItemProps } from './Item';
import { NavbarView } from './NavbarView';

export const useNavbar = () => {
  const pathname = usePathname();
  const meta = useMeta(pathname);

  return {
    meta,
  };
};

const useMeta = (pathname: string) => {
  const navBarItems: NavbarItemProps[] = [
    {
      text: '이용자 관리',
      url: '/admin/main/userService',
      active: pathname.includes('/admin/main/userService'),
      children: [
        {
          text: '카테고리 관리',
          url: '/admin/main/userService/categories',
          active: pathname === '/admin/main/userService/categories',
        },
        {
          text: '그룹 관리',
          url: '/admin/main/userService/groups',
          active: pathname === '/admin/main/userService/groups',
        },
      ],
    },
    {
      text: '예약 관리',
      url: ADMIN_RESERVATION_SERVICE_PATH,
      active: pathname.includes('/admin/main/reservationService'),
      children: [
        {
          text: '타임라인 관리',
          url: '/admin/main/userService/categories',
          active: pathname === '/admin/main/userService/categories',
        },
      ],
    },
    {
      text: '매장 관리',
      url: '/admin/main/userService',
      active: pathname.includes('/admin/main/userService-2'),
    },
    {
      text: '문의 관리',
      url: '/admin/main/userService',
      active: pathname.includes('/admin/main/userService-2'),
    },
    {
      text: '설정',
      url: '/admin/main/settingService',
      active: pathname.includes('/admin/main/settingService'),
      children: [
        {
          text: '서비스 관리',
          url: '/admin/main/settingService/services',
          active: pathname === '/admin/main/settingService/services',
        },
      ],
    },
  ];

  const sidebarNavItems = navBarItems.find(navItem => navItem.active)?.children;

  return {
    navBarItems,
    sidebarNavItems,
  };
};

export { NavbarView as Navbar };
