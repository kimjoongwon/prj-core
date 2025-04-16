'use client';

import { PageBuilder, ModalLayout } from '@/components';
import { RouteBuilder } from '@shared/types';
import { useGetAdminMainTenantsPage } from '@shared/frontend';

const TenantsPage = () => {
  const { data: response, isFetchedAfterMount } = useGetAdminMainTenantsPage();

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

export default TenantsPage;
