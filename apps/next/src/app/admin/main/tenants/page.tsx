'use client';

import { PageBuilder } from '@/builders/Page/PageBuilder';
import { ModalLayout } from '@/components/layouts/ModalLayout';
import { useGetAdminMainTenantsPage } from '@shared/frontend';
import { RouteBuilder } from '@shared/types';

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
