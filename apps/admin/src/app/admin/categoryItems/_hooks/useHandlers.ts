import { useCoCRouter } from '@hooks';
import { useState } from './useState';
import { CategoryItem } from '@__generated__/graphql';
import { CATEGORY_ITEM_EDIT_PAGE_PATH } from '@constants';

export const useHandlers = (state: ReturnType<typeof useState>) => {
  const router = useCoCRouter();

  const onClickCategoryItem = (categoryItem: CategoryItem) => {
    state.currentSelectedParentId = categoryItem.id;

    if (categoryItem.parentId === 'root') {
      state.parentIds.clear();
      state.parentIds.add('root');
      state.parentIds.add(categoryItem.id);
      return;
    }
    if (state.parentIds.has(categoryItem.id)) {
      const setIterator = state.parentIds.values();
      let currentValue = setIterator.next().value;
      while (currentValue !== categoryItem.id) {
        currentValue = setIterator.next().value;
      }
      state.parentIds.delete(currentValue);
      for (let i = 0; i < state.parentIds.size; i++) {
        const nextValue = setIterator.next().value;
        state.parentIds.delete(nextValue);
      }
    } else {
      state.parentIds.add(categoryItem.id);
    }

    state.form.parentId = categoryItem.id;
  };

  const onClickNew = () => {
    const searchParams = new URLSearchParams();
    searchParams.set('parentId', state.currentSelectedParentId);
    searchParams.toString();
    router.push({
      url: CATEGORY_ITEM_EDIT_PAGE_PATH,
      params: {
        id: 'new',
      },
      queryString: searchParams.toString(),
    });
  };

  return {
    onClickNew,
    onClickCategoryItem,
  };
};
