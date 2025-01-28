'use client';

import { PageBuilder } from '@/builders/Page/PageBuilder';
import { useGetAdminMainGroupsRoute } from '@shared/frontend';
import { RouteBuilder } from '@shared/types';

const GroupsPage = () => {
  const { data: response } = useGetAdminMainGroupsRoute();
  const route = response?.data as RouteBuilder;

  return <PageBuilder pageBuilder={route?.page} />;
};

export default GroupsPage;
