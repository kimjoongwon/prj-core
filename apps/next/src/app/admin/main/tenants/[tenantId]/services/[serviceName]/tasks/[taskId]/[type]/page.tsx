'use client';

import { PageBuilder } from '@/builders/Page/PageBuilder';
import { useGetAdminMainTaskEditPage } from '@shared/frontend';
import { RouteBuilder } from '@shared/types';
import { useParams } from 'next/navigation';

const TaskEditPage = () => {
  const params = useParams();
  const taskId = params?.taskId as string;
  const type = params.type as 'edit' | 'add';
  const { data: response, isFetchedAfterMount } = useGetAdminMainTaskEditPage(
    taskId,
    type,
  );
  const page = response?.data as RouteBuilder;

  if (!isFetchedAfterMount) {
    return null;
  }

  return <PageBuilder pageBuilder={page} />;
};

export default TaskEditPage;
