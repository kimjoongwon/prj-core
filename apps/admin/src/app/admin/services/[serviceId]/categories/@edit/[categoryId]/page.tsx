'use client';

import {
  CategoryDto,
  CategoryForm,
  FormLayout,
  useGetCategoryById,
} from '@shared/frontend';
import { observable } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useParams } from 'next/navigation';

const CategoryDetailPage = observer(() => {
  const { categoryId } = useParams<{ categoryId: string }>();

  const { data } = useGetCategoryById(categoryId, {
    query: {
      enabled: !!categoryId,
    },
  });

  const category = data?.data;

  const state = observable<{ category: CategoryDto | undefined }>({
    category,
  });

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <FormLayout title={'카테고리'}>
      <CategoryForm type="read" state={state.category!} />
    </FormLayout>
  );
});

export default CategoryDetailPage;

const useState = (props: ReturnType<typeof useQueries>) => {
  const { category } = props;
  const state = observable<{ category: CategoryDto | undefined }>({
    category,
  });

  return state;
};

const useQueries = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { data: queryData } = useGetCategoryById(categoryId, {
    query: {
      enabled: !!categoryId,
    },
  });

  return {
    category: queryData?.data,
  };
};

const useHandlers = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
};
