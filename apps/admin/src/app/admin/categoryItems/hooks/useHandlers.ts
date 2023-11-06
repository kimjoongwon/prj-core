import { useCoCRouter } from '@hooks';
import { CATEGORY_ITEM_EDIT_PAGE_PATH } from '@constants';
import { useState } from './useState';
import { useMutations } from './useMutations';
import { CategoryItem } from '@__generated__/graphql';
import { toJS } from 'mobx';

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

  const onClickCategoryItem = (selectedCategoryItem: CategoryItem) => {
    const depth = selectedCategoryItem.ancestorIds.length;
    if (!state.selectedCategoryItems[depth]) {
      state.selectedCategoryItems[depth] = selectedCategoryItem;
    } else {
      state.selectedCategoryItems.splice(depth, 3);
    }
  };

  const onClickNewCategory = ({
    ancestorIds,
    parentId,
  }: {
    parentId: string | null;
    ancestorIds: string[];
  }) => {
    const searchParams = new URLSearchParams();
    searchParams.set('parentId', parentId || '');
    searchParams.set('ancestorIds', ancestorIds.join(','));

    router.push({
      url: CATEGORY_ITEM_EDIT_PAGE_PATH,
      params: {
        categoryItemId: 'new',
      },
      queryString: searchParams.toString(),
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
