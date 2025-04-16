'use client';

import { PageBuilder } from '@/components';
import { useGetAdminMainCategoriesEditPage } from '@shared/frontend';
import { RouteBuilder } from '@shared/types';
import { useParams } from 'next/navigation';

const CategoryEditPage = () => {
  const params = useParams();
  const categoryId = params.categoryId as string;
  const type = params.type as 'edit' | 'add';
  const { data: response, isFetchedAfterMount } =
    useGetAdminMainCategoriesEditPage(categoryId, type);
  const page = response?.data as RouteBuilder;

  if (!isFetchedAfterMount) {
    return null;
  }

  return <PageBuilder pageBuilder={page} />;
};

export default CategoryEditPage;
