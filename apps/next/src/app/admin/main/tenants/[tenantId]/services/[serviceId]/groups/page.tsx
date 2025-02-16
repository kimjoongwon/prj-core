'use client';

import { PageBuilder } from '@/builders/Page/PageBuilder';
import { useGetAdminMainGroupsPage } from '@shared/frontend';

const GroupsPage = () => {
  const { data: response } = useGetAdminMainGroupsPage();
  const page = response?.data as any;

  return <PageBuilder pageBuilder={page} />;
};

export default GroupsPage;
