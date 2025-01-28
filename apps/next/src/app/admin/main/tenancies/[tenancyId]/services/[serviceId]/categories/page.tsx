'use client';

import { PageBuilder } from '@/builders/Page/PageBuilder';
import { useGetAdminMainCategoriesRoute } from '@shared/frontend';
import { RouteBuilder } from '@shared/types';

const CategoriesPage = () => {
  const { data: response } = useGetAdminMainCategoriesRoute();
  const route = response?.data as RouteBuilder;

  return <PageBuilder pageBuilder={route?.page} />;
};

export default CategoriesPage;
