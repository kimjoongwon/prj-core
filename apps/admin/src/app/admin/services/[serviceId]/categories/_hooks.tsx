import { groupBy } from 'lodash-es';
import { categroiesPageState } from './_state';
import {
  CategoryDto,
  getGetCategoriesQueryKey,
  router,
  useCreateCategory,
  useGetCategories,
  useUpdateCategory,
} from '@shared/frontend';
import { useParams } from 'next/navigation';
import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export const useCategoriesPage = () => {
  const queries = useQueries();
  const props = useProps({ queries });
  const handlers = useHandlers({ queries });

  return {
    ...props,
    ...handlers,
  };
};

const useQueries = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const { data: queryData, isLoading } = useGetCategories();
  const { mutateAsync: createCategory, isSuccess } = useCreateCategory();
  const { mutateAsync: updateCategory } = useUpdateCategory();

  return {
    isSuccess,
    createCategory,
    updateCategory,
    categories: queryData?.data.filter(
      category => category.serviceId === serviceId,
    ),
    isLoading,
  };
};

const useProps = ({ queries }: { queries: ReturnType<typeof useQueries> }) => {
  const { categories } = queries;
  const categoriesByParentId = groupBy(categories, 'parentId');
  const openedCategory = categroiesPageState.openedCategory;
  let relatedCategoryIds = ['null'];

  if (openedCategory.name) {
    relatedCategoryIds.push(...(openedCategory.ancestorIds || []));
    relatedCategoryIds.push(openedCategory.id);
  }

  return {
    categoriesGroupedByParentId: categoriesByParentId,
    relatedCategoryIds,
  };
};

const useHandlers = (props: { queries: ReturnType<typeof useQueries> }) => {
  const {
    queries: { categories, updateCategory },
  } = props;
  const { serviceId } = useParams();
  const queryClient = useQueryClient();

  const categoriesGroupedByParentId = groupBy(categories, 'parentId');

  const onClickDetail = (category: CategoryDto) => {
    router.push({
      url: '/admin/services/:serviceId/categories/:categoryId',
      params: {
        categoryId: category.id,
        serviceId,
      },
    });
  };

  const onClickCard = (category: CategoryDto) => {
    const categoriesByParentId =
      categoriesGroupedByParentId?.[category.parentId!];

    categoriesByParentId?.forEach(_category => {
      if (_category.id === category.id) {
        categroiesPageState.openedCategory = category;
      }
    });
  };

  const onClickCreate = async (category: CategoryDto) => {
    categroiesPageState.form.parentId = category.id;
    categroiesPageState.openedCategory = category;

    router.push({
      url: '/admin/services/:serviceId/categories/:categoryId/edit',
      params: {
        serviceId,
        categoryId: 'new',
      },
    });
  };

  const onClickDelete = async (category: CategoryDto) => {
    await updateCategory({
      categoryId: category.id,
      data: {
        ...category,
        deletedAt: new Date() as any,
      },
    });

    queryClient.invalidateQueries({
      queryKey: getGetCategoriesQueryKey(),
    });
  };

  return {
    onClickCreate,
    onClickDetail: useCallback(onClickDetail, [serviceId]),
    onClickCard: useCallback(onClickCard, [categoriesGroupedByParentId]),
    onClickDelete,
  };
};
