'use client';

import { DataGridLayout } from '@/components/layouts';

const GroupsLayout = (props: { children: React.ReactNode }) => {
  const { children } = props;
  return <DataGridLayout>{children}</DataGridLayout>;
};

export default GroupsLayout;
