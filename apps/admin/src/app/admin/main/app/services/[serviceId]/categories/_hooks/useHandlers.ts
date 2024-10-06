import { useQueries } from './useQueries';
import { CategoryDto, galaxy } from '@shared/frontend';
import { useContext } from './useContext';
import { useProps } from './useProps';
import { useState } from './useState';

export const useHandlers = (props: {
  context: ReturnType<typeof useContext>;
  queries: ReturnType<typeof useQueries>;
  props: ReturnType<typeof useProps>;
  state: ReturnType<typeof useState>;
}) => {
  const {
    queries: { updateCategory, invalidateGetCategories },
    props: { relatedCategoryIds, categoriesGroupedByParentId },
    state,
    context: { serviceId, queryString },
  } = props;

  const onClickDetail = (category: CategoryDto) => {
    galaxy.router.push({
      url: '/admin/main/app/services/:serviceId/categories/:categoryId',
      params: {
        categoryId: category.id,
        serviceId,
      },
    });
  };

  const onClickCard = (selectedCategory: CategoryDto) => {
    const categoriesByParentId =
      categoriesGroupedByParentId?.[selectedCategory.parentId!];

    if (relatedCategoryIds.length > 2) {
      return;
    }

    categoriesByParentId?.forEach(category => {
      if (category.id === selectedCategory.id) {
        state.selectedCategory = selectedCategory;
      }
    });
  };

  const onClickCreate = async (category?: CategoryDto) => {
    if (category) {
      state.selectedCategory = category;
    }

    galaxy.router.push({
      url: '/admin/main/app/services/:serviceId/categories/:categoryId/edit',
      params: { categoryId: 'new', serviceId },
      queryString,
    });
  };

  const onClickDelete = async (category: CategoryDto) => {
    await updateCategory({
      categoryId: category.id,
      data: {
        ...category,
        removedAt: new Date() as any,
      },
    });

    invalidateGetCategories();
  };

  return {
    onClickCreate,
    onClickDetail,
    onClickCard,
    onClickDelete,
  };
};
