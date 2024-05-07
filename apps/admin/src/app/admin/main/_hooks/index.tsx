import { ADMIN_RESERVATION_SERVICE_PATH, NavItem } from '@shared/frontend';
import { usePathname } from 'next/navigation';

export type NavItemText = '이용자 서비스' | '설정';

export const useMeta = () => {
  const pathname = usePathname();

  const topNavItems: NavItem[] = [
    {
      text: '이용자 관리',
      url: '/admin/main/userService',
      active: pathname.includes('/admin/main/userService'),
    },
    {
      text: '예약 관리',
      url: ADMIN_RESERVATION_SERVICE_PATH,
      active: pathname.includes('/admin/main/reservationService'),
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
    },
  ];

  const activeNavItem = topNavItems?.find(navItem => navItem.active);

  const sidebarNavItems: Record<string, NavItem[]> = {
    '이용자 관리': [
      {
        text: '카테고리 관리',
        url: '/admin/main/userService/categories',
        active: pathname === '/admin/main/userService/categories',
      },
    ],
    설정: [
      {
        text: '서비스 관리',
        url: '/admin/main/settingService/services',
        active: pathname === '/admin/main/settingService/services',
      },
    ],
    '예약 관리': [
      {
        text: '타임라인 관리',
        url: '/admin/main/userService/categories',
        active: pathname === '/admin/main/userService/categories',
      },
    ],
  };

  return {
    topNavItems,
    sidebarNavItems: sidebarNavItems[activeNavItem?.text as NavItemText] || [],
  };
};
