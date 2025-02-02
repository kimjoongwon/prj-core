'use client';

import { PageBuilder } from '@/builders/Page/PageBuilder';
import { useGetAdminMainCategoriesPage } from '@shared/frontend';

const CategoriesPage = () => {
  const { data: response } = useGetAdminMainCategoriesPage();
  const page = response?.data;

  return <PageBuilder pageBuilder={page} />;
};

export default CategoriesPage;
