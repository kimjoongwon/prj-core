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
} from '@constants';
import { CoCNavbar } from '@coc/web';
import { observer } from 'mobx-react-lite';
import { useAdminServiceGetMemus } from '../../api/queries';

function Layout({ children }: { children: React.ReactNode }) {
  const router = useCoCRouter();
  const { getUrlWithParams } = router;
  const auth = useAuth();

  const { data: menus } = useAdminServiceGetMemus();

  return (
    <div className="flex flex-col">
      <CoCNavbar navItems={menus} />
      {children}
    </div>
  );
}

export default observer(Layout);
