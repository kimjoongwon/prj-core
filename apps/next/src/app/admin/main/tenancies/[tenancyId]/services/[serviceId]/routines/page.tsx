'use client';

import { PageBuilder } from '@/builders/Page/PageBuilder';
import { useGetAdminMainRoutinesRoute } from '@shared/frontend';
import { RouteBuilder } from '@shared/types';

const RoutinesPage = () => {
  const { data: response } = useGetAdminMainRoutinesRoute();
  const page = response?.data;

  return <PageBuilder pageBuilder={page} />;
};

export default RoutinesPage;
