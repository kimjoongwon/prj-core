'use client';

import { PageBuilder } from '@/components';
import { useGetAdminMainGymPage, useGetGymSuspense } from '@shared/frontend';
import { PageBuilder as IPageBuilder } from '@shared/types';
import { observer } from 'mobx-react-lite';
import { useParams } from 'next/navigation';

const GymPage = observer(() => {
  const params = useParams();
  const gymId = params.gymId as string;
  const type = params.type as 'edit' | 'add' | 'detail';
  const { data: response, isFetchedAfterMount } =
    useGetAdminMainGymPage(gymId, type);
  const page = response?.data as IPageBuilder;

  if (!isFetchedAfterMount) {
    return null;
  }

  return <PageBuilder pageBuilder={page} />;
});

export default GymPage;
