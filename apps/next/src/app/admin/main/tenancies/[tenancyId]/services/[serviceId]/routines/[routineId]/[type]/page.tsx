'use client';

import { PageBuilder } from '@/builders/Page/PageBuilder';
import { useGetAdminMainRoutineEditRoute } from '@shared/frontend';
import { RouteBuilder } from '@shared/types';
import { useParams } from 'next/navigation';

const RoutineEditPage = () => {
  const params = useParams();
  const routineId = params.routineId as string;
  const type = params.type as 'edit' | 'add';
  const { data: response, isFetchedAfterMount } =
    useGetAdminMainRoutineEditRoute(routineId, type);
  const route = response?.data as RouteBuilder;

  if (!isFetchedAfterMount) {
    return null;
  }

  return <PageBuilder pageBuilder={route?.page} />;
};

export default RoutineEditPage;
