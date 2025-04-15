'use client';

import { Card, CardHeader, Divider, CardBody, Button } from '@heroui/react';
import { List } from '@shared/frontend';
import { useApp } from '@shared/frontend';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/navigation';
import { v4 } from 'uuid';

const ServiceLayout = observer((props: { children: React.ReactNode }) => {
  const { children } = props;
  const app = useApp();
  const router = useRouter();

  return (
    <div className="flex flex-col md:flex-row h-full flex-1 space-y-2 md:space-y-0 md:space-x-2 px-4 md:p-0">
      <Card className="rounded-xl w-full md:w-[200px]">
        <CardHeader>
          <div>{app.navigationService.serviceRoute?.name} </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <List
            className="flex flex-row md:flex-col"
            data={app.navigationService.serviceRoute?.children || []}
            renderItem={(route: any) => {
              return (
                <Button
                  variant="light"
                  key={v4()}
                  color={route.active ? 'primary' : 'default'}
                  onPress={() => {
                    router.push(route.pathname);
                    app.navigationService.activateRoute(route.pathname);
                  }}
                >
                  {route.name}
                </Button>
              );
            }}
          />
        </CardBody>
      </Card>
      {children}
    </div>
  );
});

export default ServiceLayout;
