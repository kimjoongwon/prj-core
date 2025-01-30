'use client';

import { DataGridLayout } from '@/components/layouts';

const SessionsLayout = (props: { children: React.ReactNode }) => {
  const { children } = props;
  return <DataGridLayout>{children}</DataGridLayout>;
};

export default SessionsLayout;
