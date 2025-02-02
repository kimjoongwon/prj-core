'use client';

import { PageBuilder } from '@/builders/Page/PageBuilder';
import { useGetAdminMainTasksPage } from '@shared/frontend';

const TasksPage = () => {
  const { data: response } = useGetAdminMainTasksPage();
  const page = response?.data;

  return <PageBuilder pageBuilder={page} />;
};

export default TasksPage;
