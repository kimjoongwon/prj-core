'use client';

import { PageBuilder } from '@/builders/Page/PageBuilder';
import { useGetAdminMainCategoriesEditRoute } from '@shared/frontend';
import { RouteBuilder } from '@shared/types';
import { useParams } from 'next/navigation';

const CategoryEditPage = () => {
  const params = useParams();
  const categoryId = params.categoryId as string;
  const type = params.type as 'edit' | 'add';
  const { data: response, isFetchedAfterMount } =
    useGetAdminMainCategoriesEditRoute(categoryId, type);
  const route = response?.data as RouteBuilder;
  console.log('type', type);
  if (!isFetchedAfterMount) {
    return null;
  }

  return <PageBuilder pageBuilder={route?.page} />;
};

export default CategoryEditPage;
