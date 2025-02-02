'use client';

import { PageBuilder } from '@/builders/Page/PageBuilder';
import { ModalLayout } from '@/components/layouts';
import { useGetAdminMainTimelineEditPage } from '@shared/frontend';
import { RouteBuilder } from '@shared/types';
import { useParams } from 'next/navigation';

const TimelineEditPage = () => {
  const params = useParams();
  const timelineId = params.timelineId as string;
  const type = params.type as 'edit' | 'add';
  const { data: response, isFetchedAfterMount } =
    useGetAdminMainTimelineEditPage(timelineId, type);
  const page = response?.data;

  if (!isFetchedAfterMount) {
    return null;
  }

  return (
    <ModalLayout>
      <PageBuilder pageBuilder={page} />
    </ModalLayout>
  );
};

export default TimelineEditPage;
