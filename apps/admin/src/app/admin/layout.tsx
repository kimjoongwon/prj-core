'use client';

import { useCoCRouter } from '@hooks';
import {
  CATEGORIES_PAGE_PATH,
  CATEGORY_ITEMS_PAGE_PATH,
  SERVICES_PAGE_PATH,
  USERS_PAGE_PATH,
  WORKSPACES_PAGE_PATH,
} from '@constants';
import { CoCNavbar, NavItem } from '@coc/ui';
import { User } from '@nextui-org/react';
import { observer } from 'mobx-react-lite';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { getUrlWithParams } = useCoCRouter();
  const pathname = usePathname();
  const items = [
    {
      text: '사용자 관리',
      href: getUrlWithParams(USERS_PAGE_PATH),
      children: [
        {
          text: '사용자목록-1',
          href: getUrlWithParams(USERS_PAGE_PATH),
        },
        {
          text: '사용자목록-2',
          href: getUrlWithParams(USERS_PAGE_PATH),
        },
      ],
    },
    {
      text: '소속 관리',
      children: [
        {
          text: '소속',
          href: getUrlWithParams(WORKSPACES_PAGE_PATH),
        },
        {
          text: '사용자목록-2',
          href: getUrlWithParams(USERS_PAGE_PATH),
        },
      ],
    },
    {
      text: '서비스목록',
      href: getUrlWithParams(SERVICES_PAGE_PATH),
    },
    {
      text: '서비스 카테고리',
      href: getUrlWithParams(CATEGORIES_PAGE_PATH),
    },
    {
      text: '카테고리관리',
      href: getUrlWithParams(CATEGORY_ITEMS_PAGE_PATH),
    },
  ];

  const convertItem = (item: any): NavItem => {
    if (item.children) {
      return {
        text: item.text,
        href: item.href,
        active: item.href === pathname,
        children: item.children.map(convertItem),
      };
    }
    return {
      text: item.text,
      href: item.href,
      active: item.href === pathname,
      children: item?.children,
    };
  };

  const menuItems = useMemo(() => items.map(convertItem), [pathname]);

  return (
    <div>
      <CoCNavbar
        navItems={menuItems}
        navMenuItems={menuItems}
        rightContents={<User name="kimjoongwon" />}
      />
      <div className="flex flex-col w-full items-center p-4">{children}</div>
    </div>
  );
}

export default observer(DashboardLayout);
