import React from 'react';
import { useCreateCategoryItem, useModal } from '@hooks';
import { useState } from './useState';
// import { CategoryItemEditModalContent } from '@components';
import { toJS } from 'mobx';
import { CategoryItem } from '@__generated__/graphql';
import { isServer } from '../../../shared/utils/isServer';

export const useHandlers = (state: ReturnType<typeof useState>) => {
  const modal = useModal();

  const [createCategoryItem] = useCreateCategoryItem({
    createCategoryItemInput: state.form,
  });

  const onClickCategoryItem = (categoryItem: CategoryItem) => {
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
    if (!isServer()) {
      // modal.content = React.createElement(CategoryItemEditModalContent, {
      //   state: state.form,
      // });
      // modal.header = '카테고리 추가';
      // modal.open();
      // modal.buttons = [
      //   {
      //     children: 'Cancel',
      //     onClick: () => {
      //       modal.close();
      //     },
      //   },
      //   {
      //     children: 'Create',
      //     onClick: () => {
      //       createCategoryItem();
      //     },
      //   },
      // ];
    }
  };

  return {
    onClickNew,
    onClickCategoryItem,
  };
};
