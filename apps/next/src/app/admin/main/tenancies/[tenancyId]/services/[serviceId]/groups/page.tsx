'use client';

import { PageBuilder } from '@/builders/Page/PageBuilder';
import { useGetAdminMainGroupsRoute } from '@shared/frontend';
import { RouteBuilder } from '@shared/types';

const GroupsPage = () => {
  const { data: response } = useGetAdminMainGroupsRoute();
  const page = response?.data as RouteBuilder;

  return <PageBuilder pageBuilder={page} />;
};

export default GroupsPage;
