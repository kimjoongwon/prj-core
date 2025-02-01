'use client';

import { PageBuilder } from '@/builders/Page/PageBuilder';
import { ModalLayout } from '@/components/layouts';
import { useGetAdminMainGroupEditRoute } from '@shared/frontend';
import { RouteBuilder } from '@shared/types';
import { useParams } from 'next/navigation';

const GroupEditPage = () => {
  const params = useParams();
  const groupId = params.groupId as string;
  const type = params.type as 'edit' | 'add';
  const { data: response, isFetchedAfterMount } = useGetAdminMainGroupEditRoute(
    groupId,
    type,
  );
  const page = response?.data as RouteBuilder;

  if (!isFetchedAfterMount) {
    return null;
  }

  return (
    <ModalLayout>
      <PageBuilder pageBuilder={page} />
    </ModalLayout>
  );
};

export default GroupEditPage;
