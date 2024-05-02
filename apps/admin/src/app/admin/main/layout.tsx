'use client';

import {
  ADMIN_MAIN_PATH,
  Avatar,
  Button,
  HStack,
  NavItem,
  Navbar,
  ServiceEntity,
  Sidebar,
  authStore,
  router,
  useGetAllService,
} from '@shared/frontend';
import { observable } from 'mobx';
import { observer } from 'mobx-react-lite';
import { usePathname } from 'next/navigation';

interface MainLayoutProps {
  children: React.ReactNode;
}

const mainPageState = observable({
  currentService: {} as ServiceEntity,
  sidebarNavItems: [] as NavItem[],
});

const MainLayout = (props: MainLayoutProps) => {
  const { children } = props;
  const { topNavItems, sidebarNavItems } = useMeta();

  const pathname = usePathname();

  return (
    <>
      <Navbar
        rightContents={
          <>
            <Avatar name={authStore.user?.email || 'test!'} />
            <Button color="danger" variant="flat">
              나가기
            </Button>
          </>
        }
        navItems={topNavItems}
      />
      <HStack className="container">
        {pathname !== ADMIN_MAIN_PATH && <Sidebar navItems={sidebarNavItems} />}
        {children}
      </HStack>
    </>
  );
};

export default observer(MainLayout);

export const useMeta = () => {
  const { data: services } = useGetAllService();
  const pathname = usePathname();

  const topNavItems: NavItem[] =
    services?.map(service => {
      return {
        button: {
          children: service.name,
          onClick: () => {
            const url = router.getUrlWithParamsAndQueryString(
              '/admin/main/services/:serviceId',
              {
                serviceId: service.id,
              },
            );
            router.push({ url });
          },
        },
        active: pathname.includes(service.id),
      };
    }) || [];

  const activeService = services?.find(service =>
    pathname.includes(service.id),
  );

  const sidebarNavItems: Record<ServiceEntity['name'], NavItem[]> = {
    USER: [
      {
        button: {
          children: '유저 카테고리',
        },
        link: {
          href: router.getUrlWithParamsAndQueryString(
            '/admin/main/services/:serviceId/categories',
            {
              serviceId: activeService?.id,
            },
          ),
        },
      },
    ],
    SPACE: [
      {
        button: {
          children: '공간 카테고리',
        },
        link: {
          href: router.getUrlWithParamsAndQueryString(
            '/admin/main/services/:serviceId/categories',
            {
              serviceId: activeService?.id,
            },
          ),
        },
      },
    ],
    SETTING: [
      {
        button: {
          children: '서비스 관리',
        },
        link: {
          href: router.getUrlWithParamsAndQueryString(
            '/admin/main/services/:serviceId/services',
            {
              serviceId: activeService?.id,
            },
          ),
        },
      },
    ],
  };

  return {
    topNavItems,
    sidebarNavItems: sidebarNavItems[activeService?.name!],
  };
};
