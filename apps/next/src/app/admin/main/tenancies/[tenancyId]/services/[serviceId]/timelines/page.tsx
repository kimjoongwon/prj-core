'use client';

import { PageBuilder } from '@/builders/Page/PageBuilder';
import { useGetAdminMainTimelinesRoute } from '@shared/frontend';
import { RouteBuilder } from '@shared/types';

const TimelinesPage = () => {
  const { data: response } = useGetAdminMainTimelinesRoute();
  const route = response?.data as RouteBuilder;

  return <PageBuilder pageBuilder={route?.page} />;
};

export default TimelinesPage;
