'use client';

import { HStack, Button, AppBar } from '@shared/frontend';
import { useStore } from '@shared/stores';
import { action, toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useParams, usePathname, useRouter } from 'next/navigation';

export const Header = observer(() => {
  const router = useRouter();
  const store = useStore();
  const pathname = usePathname();

  return (
    <AppBar
      content={
        <HStack className="justify-center">
          {store.navigation.servicesRoute?.children?.map(route => {
            return (
              <Button
                key={route.pathname}
                variant="light"
                color={
                  pathname.includes(route.pathname) ? 'primary' : 'default'
                }
                onPress={action(() => {
                  router.push(route.pathname + '/categories');
                  store.navigation.activateRoute(
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
