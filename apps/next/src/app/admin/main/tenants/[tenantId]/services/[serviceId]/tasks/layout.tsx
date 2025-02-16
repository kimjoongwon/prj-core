'use client';

import { DataGridLayout } from '@/components/layouts';

const TasksLayout = (props: { children: React.ReactNode }) => {
  const { children } = props;
  return <DataGridLayout>{children}</DataGridLayout>;
};

export default TasksLayout;
