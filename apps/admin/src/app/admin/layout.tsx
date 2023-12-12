'use client';

import { useAuth, useCoCRouter } from '@hooks';
import {
  CATEGORIES_PAGE_PATH,
  ROLES_PAGE_PATH,
  SESSIONS_PAGE_PATH,
  TIMELINES_PAGE_PATH,
  USERS_PAGE_PATH,
  SPACES_PAGE_PATH,
  GROUPS_PAGE_PATH,
  LOGIN_PAGE_PATH,
} from '@constants';
import { CoCNavbar } from '@coc/ui';
import { Spacer, User } from '@nextui-org/react';
import { observer } from 'mobx-react-lite';
import { FcNext } from 'react-icons/fc';
import { FcBusinessman } from 'react-icons/fc';
import { FcManager } from 'react-icons/fc';
import { FcOrgUnit } from 'react-icons/fc';
import { FcFolder } from 'react-icons/fc';
import { FcGenealogy } from 'react-icons/fc';
import { FcOvertime } from 'react-icons/fc';
import { FcTimeline } from 'react-icons/fc';
import { authStore } from '@stores';

function Layout({ children }: { children: React.ReactNode }) {
  const router = useCoCRouter();
  const { getUrlWithParams } = router;
  const auth = useAuth();

  const items = [
    {
      text: '사용자 서비스',
      children: [
        {
          text: '역할 목록',
          startContent: <FcBusinessman />,
          endContent: <FcNext />,
          href: getUrlWithParams(ROLES_PAGE_PATH),
        },
        {
          text: '사용자 목록',
          startContent: <FcManager />,
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
          startContent: <FcOrgUnit />,
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
          startContent: <FcFolder />,
          endContent: <FcNext />,
          href: getUrlWithParams(CATEGORIES_PAGE_PATH),
        },
      ],
    },
    {
      text: '그룹 서비스',
      children: [
        {
          text: '그룹 관리',
          startContent: <FcGenealogy />,
          endContent: <FcNext />,
          href: getUrlWithParams(GROUPS_PAGE_PATH),
        },
      ],
    },
    {
      text: '예약 서비스',
      children: [
        {
          text: '예약 관리',
          startContent: <FcOvertime />,
          endContent: <FcNext />,
          href: getUrlWithParams(SESSIONS_PAGE_PATH),
        },
        {
          text: '타임라인 관리',
          startContent: <FcTimeline />,
          endContent: <FcNext />,
          href: getUrlWithParams(TIMELINES_PAGE_PATH, { sessionId: 'test' }),
        },
      ],
    },
  ];

  return (
    <div>
      <div className="flex">
        <aside className="flex-0 basis-20" />
        <div className="flex flex-1 flex-col w-full items-center p-4">
          <CoCNavbar
            navItems={items}
            rightContents={
              <User
                name={authStore.user?.email}
                onClick={() =>
                  auth.handlers.logout(() =>
                    router.push({ url: LOGIN_PAGE_PATH }),
                  )
                }
              />
            }
          />
          <Spacer y={10} />
          {children}
        </div>
        <aside className="flex-0 basis-20" />
      </div>
    </div>
  );
}

export default observer(Layout);
