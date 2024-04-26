'use client';

import { ButtonProps, Spinner } from '@nextui-org/react';
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

const CategoryPage = observer(() => {
  const { leftButtons, rightButtons, state, isLoading } = useCategoryPage();

  if (isLoading) {
    return <Spinner />;
  }

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

export default CategoryPage;

export const useCategoryPage = () => {
  const queries = useQueries();
  const state = useState({ queries });
  const handlers = useHandlers({ queries, state });
  const meta = useMeta({ handlers });

  return {
    isLoading: queries.isGetCategoryByIdLoading,
    state,
    ...meta,
  };
};

const useState = ({ queries }: { queries: ReturnType<typeof useQueries> }) => {
  const { category } = queries;
  const state = observable<{ category: CategoryDto | undefined }>({
    category,
  });

  return state;
};

const useQueries = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { data: queryData, isLoading: isGetCategoryByIdLoading } =
    useGetCategoryById(categoryId, {
      query: {
        enabled: !!categoryId,
      },
    });
  const { mutateAsync: updateCategory } = useUpdateCategory();

  return {
    isGetCategoryByIdLoading,
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

  const { categoryId, serviceId } = useParams<{
    categoryId: string;
    serviceId: string;
  }>();

  const onClickEdit = () => {
    navStore.push({
      url: '/admin/services/:serviceId/categories/:categoryId/edit',
      params: {
        categoryId,
        serviceId,
      },
    });
  };

  const onClickDelete = () => {
    updateCategory({
      categoryId,
      data: {
        deletedAt: new Date().toString(),
      },
    });
  };

  return {
    onClickEdit,
    onClickDelete,
  };
};

const useMeta = ({
  handlers,
}: {
  handlers: ReturnType<typeof useHandlers>;
}) => {
  const { onClickDelete, onClickEdit } = handlers;
  const leftButtons: ButtonProps[] = [
    {
      onClick: onClickDelete,
      children: '삭제',
      color: 'danger',
    },
  ];

  const rightButtons: ButtonProps[] = [
    {
      children: '수정',
      onClick: onClickEdit,
    },
  ];

  return {
    leftButtons,
    rightButtons,
  };
};
