'use client';

import { PageBuilder } from '@/components';
import { useGetAdminMainGroupEditPageSuspense } from '@shared/frontend';
import { RouteBuilder } from '@shared/types';
import { useParams } from 'next/navigation';

const GroupEditPage = () => {
  const params = useParams();
  const groupId = params.groupId as string;
  const type = params.type as 'edit' | 'add' | 'detail';

  const { data: response } = useGetAdminMainGroupEditPageSuspense(
    groupId,
    type,
  );
  const page = response?.data as RouteBuilder;

  return <PageBuilder pageBuilder={page} />;
};

export default GroupEditPage;
