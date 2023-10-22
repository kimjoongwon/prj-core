'use client';

import { useCoCRouter } from '@hooks';
import { Navbar } from '@coc/ui';
import {
  CATEGORIES_PAGE_PATH,
  CATEGORY_ITEMS_PAGE_PATH,
  SERVICES_PAGE_PATH,
  USERS_PAGE_PATH,
} from '@constants';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { getUrlWithParams } = useCoCRouter();

  const items = [
    {
      text: '사용자목록',
      href: getUrlWithParams(USERS_PAGE_PATH),
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

  return (
    <div>
      <Navbar navItems={items} navMenuItems={items} />
      {children}
    </div>
  );
}
