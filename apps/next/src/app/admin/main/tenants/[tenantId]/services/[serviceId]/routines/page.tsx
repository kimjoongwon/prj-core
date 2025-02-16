'use client';

import { PageBuilder } from '@/builders/Page/PageBuilder';
import { useGetAdminMainRoutinesPage } from '@shared/frontend';
import { RouteBuilder } from '@shared/types';

const RoutinesPage = () => {
  const { data: response } = useGetAdminMainRoutinesPage();
  const page = response?.data;

  return <PageBuilder pageBuilder={page} />;
};

export default RoutinesPage;
