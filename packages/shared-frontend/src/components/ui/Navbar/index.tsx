'use client';

import { observer } from 'mobx-react-lite';
import { HStack } from '../HStack';
import Button from '../Button';
import {
  ADMIN_RESERVATION_SERVICE_PATH,
  Paths,
} from '../../../constants/Paths';
import { Logo } from '../Logo';
import { VStack } from '../VStack';

import { v4 } from 'uuid';
import { usePathname } from 'next/navigation';
import { AdminMainLayout } from '../../layouts/Main';
import { Sidebar } from '../Sidebar';
import { myUniv } from '../../../providers/App';

export interface NavItem {
  url: Paths;
  text: string;
  children?: NavItem[];
  active: boolean;
  params?: object;
}

interface NavbarProps {
  navItems?: NavItem[];
  rightContents?: React.ReactNode;
  leftContents?: React.ReactNode;
}

export const getTopNavItems = (pathname: string): NavItem[] => [
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

export const getSidebarNavItems = (
  pathname: string,
): Record<string, NavItem[]> => ({
  '이용자 관리': [
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
});

export const Navbar = observer((props: NavbarProps) => {
  const { rightContents, leftContents } = props;
  const pathname = usePathname();

  const navItems = getTopNavItems(pathname);

  const renderNavItem = (navItem: NavItem): React.ReactNode => {
    const { children, url, text, params, active } = navItem;
    if (children) {
      return children?.map(renderNavItem);
    }

    const onClickNavItem = () => {
      myUniv?.router.push({
        url,
        params,
      });
    };

    return (
      <Button
        key={v4()}
        variant="light"
        className="font-semibold"
        color={active ? 'primary' : 'default'}
        onClick={onClickNavItem}
      >
        {text}
      </Button>
    );
  };

  return (
    <VStack className="w-full border-b-1 items-center justify-center flex-grow-0 flex-shrink basis-16">
      <HStack className="container px-4 justify-between">
        <HStack className="flex-1 items-center">
          <Logo variants="text" alt={'LOGO'} />
          {leftContents}
        </HStack>
        <HStack className="flex-1 gap-2 items-center justify-center">
          {navItems?.map(renderNavItem)}
        </HStack>
        <HStack className="flex-1 items-center gap-2 justify-end">
          {rightContents}
        </HStack>
      </HStack>
      {/* <HStack className="container h-full">
        <Sidebar navItems={sidebarNavItems} />
        <VStack className="m-4 w-full border-1 rounded-lg">{children}</VStack>;
        <AdminMainLayout>{children}</AdminMainLayout>
      </HStack> */}
    </VStack>
  );
});
