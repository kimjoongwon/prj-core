'use client';

import { PageBuilder } from '@/builders/Page/PageBuilder';
import { ModalLayout } from '@/components/layouts/ModalLayout';
import { useGetAdminMainTenanciesPage } from '@shared/frontend';
import { RouteBuilder } from '@shared/types';

const TenanciesPage = () => {
  const { data: response } = useGetAdminMainTenanciesPage();

  const page = response?.data as RouteBuilder;

  return (
    <ModalLayout>
      <PageBuilder pageBuilder={page} />
    </ModalLayout>
  );
};

export default TenanciesPage;
