'use client';

import { ButtonProps } from '@nextui-org/react';
import {
  CategoryDto,
  CategoryForm,
  FormLayout,
  useGetCategoryById,
  useUpdateCategory,
} from '@shared/frontend';
import { navStore } from '@stores';
import { observable } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useParams } from 'next/navigation';

const CategoryDetailPage = observer(() => {
  const {
    state,
    handlers: { onClickCancel, onClickEdit },
  } = useCategoryPage();

  const leftButtons: ButtonProps[] = [
    {
      onClick: onClickCancel,
      children: '취소',
    },
  ];

  const rightButtons: ButtonProps[] = [
    {
      children: '저장',
      onClick: onClickEdit,
    },
  ];

  return (
    <FormLayout
      title="카테고리"
      leftButtons={leftButtons}
      rightButtons={rightButtons}
    >
      <CategoryForm type="read" state={state.category!} />
    </FormLayout>
  );
});

export default CategoryDetailPage;

export const useCategoryPage = () => {
  const queries = useQueries();
  const state = useState(queries);
  const handlers = useHandlers({ queries, state });

  return {
    state,
    handlers,
  };
};

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
  const { mutateAsync: updateCategory } = useUpdateCategory();

  return {
    updateCategory,
    category: queryData?.data,
  };
};

const useHandlers = (props: {
  queries: ReturnType<typeof useQueries>;
  state: ReturnType<typeof useState>;
}) => {
  const {
    queries: { updateCategory },
    state,
  } = props;

  const { categoryId } = useParams<{
    categoryId: string;
    serviceId: string;
  }>();

  const onClickEdit = async () => {
    await updateCategory({
      categoryId,
      data: state.category!,
    });
  };

  const onClickCancel = () => navStore.back();
  return {
    onClickEdit,
    onClickCancel,
  };
};
