import { Button, HStack, useGetAdminMainServicesPage } from '@shared/frontend';
import { PathUtil } from '@shared/utils';
import { action } from 'mobx';
import { useRouter } from 'next/navigation';
import { v4 } from 'uuid';

export const BottomTab = () => {
  const router = useRouter();
  const { data: response } = useGetAdminMainServicesPage();
  const serviceRoutes = response?.data as {
    name: string;
    pathname: string;
    active: boolean;
  }[];

  return (
    <HStack className="justify-center">
      {serviceRoutes?.map(route => {
        return (
          <Button
            key={v4()}
            variant="light"
            color={route.active ? 'primary' : 'default'}
            onPress={action(() => {
              router.push(
                PathUtil.getUrlWithParamsAndQueryString(
                  route.pathname + '/categories',
                ),
              );
            })}
          >
            {route.name}
          </Button>
        );
      })}
    </HStack>
  );
};
