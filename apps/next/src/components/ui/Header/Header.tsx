'use client';

import { HStack, Button, AppBar } from '@shared/frontend';
import { useApp } from '@shared/frontend';
import { useSetCookie } from 'cookies-next';
import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const Header = observer(() => {
  const router = useRouter();
  const app = useApp();
  const pathname = usePathname();
  const setCookie = useSetCookie();
  const { serviceId = '' } = useParams();

  useEffect(() => {
    setCookie('serviceId', serviceId);
  }, [serviceId]);

  return (
    <AppBar
      content={
        <HStack className="justify-center">
          {app.navigationService.servicesRoute?.children?.map(route => {
            return (
              <Button
                key={route.pathname}
                variant="light"
                color={
                  pathname.includes(route.pathname) ? 'primary' : 'default'
                }
                onPress={action(() => {
                  router.push(route.pathname + '/categories');
                  app.navigationService.activateRoute(
                    route.pathname + '/categories',
                  );
                })}
              >
                {route.name}
              </Button>
            );
          })}
        </HStack>
      }
    />
  );
});
