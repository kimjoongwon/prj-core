import { useQueryClient } from '@tanstack/react-query';
import { groupBy } from 'lodash-es';
import { useParams } from 'next/navigation';
import { useQueries } from './useQueries';
import {
  CategoryDto,
  getGetCategoriesQueryKey,
  myUniv,
} from '@shared/frontend';
import { categroiesPageState } from './state';
import { useCallback } from 'react';
import { useProps } from './useProps';

export const useHandlers = (props: {
  queries: ReturnType<typeof useQueries>;
  props: ReturnType<typeof useProps>;
}) => {
  const {
    queries: { categories, updateCategory },
    props: { relatedCategoryIds },
  } = props;
  const { serviceId } = useParams();
  const queryClient = useQueryClient();

  const categoriesGroupedByParentId = groupBy(categories, 'parentId');

  const onClickDetail = (category: CategoryDto) => {
    myUniv.router.push({
      url: '/admin/main/settingService/services/:serviceId/edit',
      params: {
        categoryId: category.id,
        serviceId,
      },
    });
  };

  const onClickCard = (category: CategoryDto) => {
    const categoriesByParentId =
      categoriesGroupedByParentId?.[category.parentId!];

    if (relatedCategoryIds.length > 2) {
      return;
    }

    categoriesByParentId?.forEach(_category => {
      if (_category.id === category.id) {
        categroiesPageState.openedCategory = category;
      }
    });
  };

  const onClickCreate = async (category?: CategoryDto) => {
    if (category) {
      categroiesPageState.form.parentId = category.id;
      categroiesPageState.openedCategory = category;
    }

    router.push({
      url: '/admin/main/userService/categories/:categoryId/edit',
      params: {
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

    categroiesPageState.openedCategory = {} as CategoryDto;

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
