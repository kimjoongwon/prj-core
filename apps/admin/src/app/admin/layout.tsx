'use client';

import { useAccount, useCoCRouter } from '@hooks';
import {
  CATEGORIES_PAGE_PATH,
  ROLES_PAGE_PATH,
  SESSIONS_PAGE_PATH,
  TIMELINES_PAGE_PATH,
  USERS_PAGE_PATH,
  SPACES_PAGE_PATH,
} from '@constants';
import { CoCNavbar } from '@coc/ui';
import { User } from '@nextui-org/react';
import { observer } from 'mobx-react-lite';
import { FcNext } from 'react-icons/fc';
function Layout({ children }: { children: React.ReactNode }) {
  const { getUrlWithParams } = useCoCRouter();
  const account = useAccount();

  const items = [
    {
      text: '사용자 서비스',
      children: [
        {
          text: '역할 목록',
          endContent: <FcNext />,
          href: getUrlWithParams(ROLES_PAGE_PATH),
        },
        {
          text: '사용자 목록',
          endContent: <FcNext />,
          href: getUrlWithParams(USERS_PAGE_PATH),
        },
      ],
    },
    {
      text: '소속 관리',
      children: [
        {
          text: '소속',
          endContent: <FcNext />,
          href: getUrlWithParams(SPACES_PAGE_PATH),
        },
      ],
    },
    {
      text: '카테고리 서비스',
      children: [
        {
          text: '카테고리 관리',
          endContent: <FcNext />,
          href: getUrlWithParams(CATEGORIES_PAGE_PATH),
        },
      ],
    },
    {
      text: '그룹 서비스',
      children: [
        {
          text: '카테고리 관리',
          endContent: <FcNext />,
          href: getUrlWithParams(CATEGORIES_PAGE_PATH),
        },
      ],
    },
    {
      text: '예약 서비스',
      children: [
        {
          text: '예약 관리',
          endContent: <FcNext />,
          href: getUrlWithParams(SESSIONS_PAGE_PATH),
        },
        {
          text: '타임라인 관리',
          endContent: <FcNext />,
          href: getUrlWithParams(TIMELINES_PAGE_PATH, { sessionId: 'test' }),
        },
      ],
    },
  ];
  console.log(account.user?.email);
  return (
    <div>
      <CoCNavbar
        navItems={items}
        rightContents={<User name={account.user?.email} />}
      />
      <div className="flex flex-col w-full items-center p-4">{children}</div>
    </div>
  );
}

export default observer(Layout);
