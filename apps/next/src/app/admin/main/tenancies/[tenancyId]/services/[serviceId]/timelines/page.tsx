'use client';

import { PageBuilder } from '@/builders/Page/PageBuilder';
import { useGetAdminMainTimelinesPage } from '@shared/frontend';

const TimelinesPage = () => {
  const { data: response } = useGetAdminMainTimelinesPage();
  const page = response?.data;

  return <PageBuilder pageBuilder={page} />;
};

export default TimelinesPage;
