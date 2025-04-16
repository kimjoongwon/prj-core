'use client';

import { PageBuilder } from '@/components/builders/Page/PageBuilder';
import { useGetAdminMainCategoriesPage } from '@shared/frontend';

export const CategoriesPage = () => {
  const { data: response } = useGetAdminMainCategoriesPage();
  const page = response?.data;

  return <PageBuilder pageBuilder={page} />;
};
