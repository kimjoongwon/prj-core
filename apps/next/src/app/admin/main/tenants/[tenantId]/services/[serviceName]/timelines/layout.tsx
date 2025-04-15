'use client';

import { DataGridLayout } from '@/components/layouts';

const TimelinesLayout = (props: { children: React.ReactNode }) => {
  const { children } = props;
  return <DataGridLayout>{children}</DataGridLayout>;
};

export default TimelinesLayout;
