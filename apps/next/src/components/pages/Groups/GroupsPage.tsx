'use client';

import { PageBuilder } from '@/components/builders/Page/PageBuilder';
import { useGetAdminMainGroupsPage } from '@shared/frontend';

export const GroupsPage = () => {
  const { data: response } = useGetAdminMainGroupsPage();
  const page = response?.data as any;

  return <PageBuilder pageBuilder={page} />;
};
