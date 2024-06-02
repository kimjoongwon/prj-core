import { observer } from 'mobx-react-lite';
import { v4 } from 'uuid';
import { usePathname } from 'next/navigation';
import { NavItem, getTopNavItems } from '../Navbar';

import { VStack } from '../VStack';
import Button from '../Button';
import { myUniv } from '../../../providers/App';

export const Sidebar = observer(() => {
  const pathname = usePathname();
  const activeNavItem = getTopNavItems(pathname)?.find(
    navItem => navItem.active,
  );

  const sidebarNavItems: Record<string, NavItem[]> = {
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
  };
  return (
    <VStack className="flex-grow-0 basis-44 border-1 mt-4 p-2">
      {sidebarNavItems['이용자 관리'].map(navItem => {
        return (
          <Button
            key={v4()}
            variant="light"
            className="font-bold"
            color={navItem.active ? 'primary' : 'default'}
            onClick={() =>
              myUniv?.router.push({ url: navItem.url || '/admin/main' })
            }
          >
            {navItem.text}
          </Button>
        );
      })}
    </VStack>
  );
});
