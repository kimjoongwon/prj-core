'use client';

import { PageBuilder } from '@/builders/Page/PageBuilder';
import { useGetAdminMainCategoriesRoute } from '@shared/frontend';

const CategoriesPage = () => {
  const { data: response } = useGetAdminMainCategoriesRoute();
  const page = response?.data;

  return <PageBuilder pageBuilder={page} />;
};

export default CategoriesPage;
