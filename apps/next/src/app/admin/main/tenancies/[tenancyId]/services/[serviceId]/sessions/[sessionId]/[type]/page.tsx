'use client';

import { PageBuilder } from '@/builders/Page/PageBuilder';
import { useGetAdminMainSessionEditRoute } from '@shared/frontend';
import { RouteBuilder } from '@shared/types';
import { useParams } from 'next/navigation';

const SessionEditPage = () => {
  const params = useParams();
  const sessionId = params.sessionId as string;
  const type = params.type as 'edit' | 'add';
  const { data: response, isFetchedAfterMount } =
    useGetAdminMainSessionEditRoute(sessionId, type);
  const page = response?.data;

  if (!isFetchedAfterMount) {
    return null;
  }

  return <PageBuilder pageBuilder={page} />;
};

export default SessionEditPage;
