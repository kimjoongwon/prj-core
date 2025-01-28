import { Button, HStack, useGetAdminMainServicesRoute } from '@shared/frontend';
import { PathUtil } from '@shared/utils';
import { action } from 'mobx';
import { useRouter } from 'next/navigation';
import { v4 } from 'uuid';

export const BottomTab = () => {
  const router = useRouter();
  const { data: response } = useGetAdminMainServicesRoute();
  const serviceRoutes = response?.data as any;

  return (
    <HStack className="justify-center">
      {serviceRoutes?.map((route: any) => {
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
