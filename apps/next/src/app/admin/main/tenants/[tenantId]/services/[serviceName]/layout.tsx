'use client';

import { Card, CardHeader, Divider, CardBody, Button } from '@heroui/react';
import { ILLIT, List } from '@shared/frontend';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/navigation';
import { v4 } from 'uuid';

const ServiceLayout = observer((props: { children: React.ReactNode }) => {
  const { children } = props;
  const router = useRouter();

  return (
    <div className="flex flex-row h-full flex-1 border-2 space-x-2">
      <Card className="rounded-xl w-[200px]">
        <CardHeader>
          <div className="font-bold text-xl">
            {ILLIT.navigation.serviceRoute?.name}
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <List
            className="flex flex-col"
            data={ILLIT.navigation.serviceRoute?.children || []}
            renderItem={(route: any) => {
              return (
                <Button
                  variant="light"
                  key={v4()}
                  color={route.active ? 'primary' : 'default'}
                  onPress={() => {
                    router.push(route.pathname);
                    ILLIT.navigation.activateRoute(route.pathname);
                  }}
                >
                  {route.name}
                </Button>
              );
            }}
          />
        </CardBody>
      </Card>
      <Card className="flex flex-col flex-1 p-4 space-y-2">{children}</Card>
    </div>
  );
});

export default ServiceLayout;
