'use client';

import { PageBuilder } from '@/builders/Page/PageBuilder';
import { useGetAdminMainRoutineEditPage } from '@shared/frontend';
import { useParams } from 'next/navigation';

const RoutineEditPage = () => {
  const params = useParams();
  const routineId = params.routineId as string;
  const type = params.type as 'edit' | 'add';
  const { data: response, isFetchedAfterMount } =
    useGetAdminMainRoutineEditPage(routineId, type);
  const page = response?.data;

  if (!isFetchedAfterMount) {
    return null;
  }

  return <PageBuilder pageBuilder={page} />;
};

export default RoutineEditPage;
