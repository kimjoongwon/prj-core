'use client';

import { PageBuilder } from '@/builders/Page/PageBuilder';
import { useGetAdminMainSessionsRoute } from '@shared/frontend';
import { RouteBuilder } from '@shared/types';

const SessionsPage = () => {
  const { data: response } = useGetAdminMainSessionsRoute();
  const route = response?.data as RouteBuilder;

  return <PageBuilder pageBuilder={route?.page} />;
};

export default SessionsPage;
