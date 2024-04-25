'use client';

import { useGetCategoryById } from '@shared/frontend';
import { useParams } from 'next/navigation';

const CategoryEditPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();

  const { data } = useGetCategoryById(categoryId, {
    query: {
      enabled: !!categoryId,
    },
  });

  const category = data?.data;

  return <div>{category?.name}</div>;
};

export default CategoryEditPage;
