'use client';

import { DataGridLayout } from '@/components/layouts';

const CategroiesLayout = (props: { children: React.ReactNode }) => {
  const { children } = props;
  return <DataGridLayout>{children}</DataGridLayout>;
};

export default CategroiesLayout;
