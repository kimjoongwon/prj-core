'use client';

import { PageBuilder } from '@/builders/Page/PageBuilder';
import { useGetAdminMainRoutinesRoute } from '@shared/frontend';
import { RouteBuilder } from '@shared/types';

const RoutinesPage = () => {
  const { data: response } = useGetAdminMainRoutinesRoute();
  const route = response?.data as RouteBuilder;

  return <PageBuilder pageBuilder={route?.page} />;
};

export default RoutinesPage;
