'use client';

import { PageBuilder } from '@/builders/Page/PageBuilder';
import { useGetAdminMainTimelinesRoute } from '@shared/frontend';

const TimelinesPage = () => {
  const { data: response } = useGetAdminMainTimelinesRoute();
  const page = response?.data;

  return <PageBuilder pageBuilder={page} />;
};

export default TimelinesPage;
