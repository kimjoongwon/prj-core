import { useCoCRouter } from '@hooks';
import { CATEGORY_ITEM_EDIT_PAGE_PATH } from '@constants';
import { CategoryItemState, useState } from './useState';
import { cloneDeep } from 'lodash-es';
import { useMutations } from './useMutations';
import { CategoryItem } from '@__generated__/graphql';
import { useQueries } from './useQueries';

export const useHandlers = (context: {
  state: ReturnType<typeof useState>;
  mutations: ReturnType<typeof useMutations>;
}) => {
  const {
    state,
    mutations: {
      deleteCategoryItem: [deleteCategoryItem],
    },
  } = context;
  const router = useCoCRouter();

  const onClickCategoryItem = (selectedCategoryItem: CategoryItemState) => {
    state.selectedCategoryItem = selectedCategoryItem;
    state.categoryItems
      .filter(
        categoryItem =>
          categoryItem.ancestorIds.length ===
          selectedCategoryItem.ancestorIds.length,
      )
      .forEach(categoryItem => {
        if (categoryItem.id === selectedCategoryItem.id) {
          categoryItem.isSelected = true;
          return;
        }
        categoryItem.isSelected = false;
      });
  };

  const onClickNewCategory = () => {
    router.push({
      url: CATEGORY_ITEM_EDIT_PAGE_PATH,
      params: {
        categoryItemId: 'new',
      },
    });
  };

  const onClickDeleteIcon = (selectedCategoryItemId: string) => {
    deleteCategoryItem({
      variables: {
        id: selectedCategoryItemId,
      },
    });
  };

  return { onClickDeleteIcon, onClickNewCategory, onClickCategoryItem };
};
