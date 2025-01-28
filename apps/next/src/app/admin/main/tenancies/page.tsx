'use client';

import { PageBuilder } from '@/builders/Page/PageBuilder';
import { ModalLayout } from '@/components/layouts/ModalLayout';
import { useGetAdminMainTenanciesRoute } from '@shared/frontend';
import { RouteBuilder } from '@shared/types';

const TenanciesPage = () => {
  const { data: response } = useGetAdminMainTenanciesRoute();

  const routeBuilder = response?.data as RouteBuilder;

  return (
    <ModalLayout>
      <PageBuilder pageBuilder={routeBuilder?.page} />;
    </ModalLayout>
  );
};

export default TenanciesPage;
