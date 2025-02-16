'use client';

import { PageBuilder } from '@/builders/Page/PageBuilder';
import { useGetAdminMainSessionsPage } from '@shared/frontend';
import { RouteBuilder } from '@shared/types';

const SessionsPage = () => {
  const { data: response } = useGetAdminMainSessionsPage();
  const page = response?.data as RouteBuilder;

  return <PageBuilder pageBuilder={page} />;
};

export default SessionsPage;
