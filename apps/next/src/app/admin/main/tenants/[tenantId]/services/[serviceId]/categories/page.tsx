'use client';

import { PageBuilder } from '@/builders/Page/PageBuilder';
import { useGetAdminMainCategoriesPage } from '@shared/frontend';

const CategoriesPage = () => {
  const { data: response, isFetchedAfterMount } =
    useGetAdminMainCategoriesPage();
  const page = response?.data;

  if (!isFetchedAfterMount) {
    return null;
  }

  return <PageBuilder pageBuilder={page} />;
};

export default CategoriesPage;
