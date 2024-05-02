'use client';

import {
  NavItem,
  ServiceEntity,
  router,
  useGetAllService,
} from '@shared/frontend';
import { observable } from 'mobx';
import { observer } from 'mobx-react-lite';

interface ServicesLayoutProps {
  children: React.ReactNode;
}

const servicesPageState = observable({
  currentService: {} as ServiceEntity,
  sidebarNavItems: [] as NavItem[],
});

const ServicesLayout = (props: ServicesLayoutProps) => {
  const { children } = props;

  return <>{children}</>;
};

export default observer(ServicesLayout);
