'use client';

import { useCoCRouter } from '@hooks';
import {
  CATEGORIES_PAGE_PATH,
  CATEGORY_ITEMS_PAGE_PATH,
  GROUPS_PAGE_PATH,
  ROLES_PAGE_PATH,
  SERVICES_PAGE_PATH,
  SESSIONS_PAGE_PATH,
  TIMELINES_PAGE_PATH,
  USERS_PAGE_PATH,
  SPACES_PAGE_PATH,
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
          text: '역할 목록',
          href: getUrlWithParams(ROLES_PAGE_PATH),
        },
        {
          text: '사용자 목록',
          href: getUrlWithParams(USERS_PAGE_PATH),
        },
      ],
    },
    {
      text: '그룹 관리',
      children: [
        {
          text: '그룹 관리',
          href: getUrlWithParams(GROUPS_PAGE_PATH),
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
          href: getUrlWithParams(SPACES_PAGE_PATH),
        },
        {
          text: '사용자목록-2',
          href: getUrlWithParams(USERS_PAGE_PATH),
        },
      ],
    },
    {
      text: '예약 관리',
      children: [
        {
          text: '예약 관리',
          href: getUrlWithParams(SESSIONS_PAGE_PATH),
        },
        {
          text: '타임라인 관리',
          href: getUrlWithParams(TIMELINES_PAGE_PATH, { sessionId: 'test' }),
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
