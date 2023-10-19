import React from 'react';
import { useCreateCategoryItem, useModal } from '@hooks';
import { useState } from './useState';
import { CategoryItemEditModalContent } from '@components';

export const useHandlers = (state: ReturnType<typeof useState>) => {
  const modal = useModal();

  const [createCategoryItem] = useCreateCategoryItem({
    createCategoryItemInput: state.form,
  });

  const onClickCategoryItem = (id: string) => {
    state.parentIds.push(id);
    state.form.parentId = id;
  };

  const onClickNew = (parentId: string) => {
    state.form.parentId = parentId;
    modal.content = React.createElement(CategoryItemEditModalContent, {
      state: state.form,
    });
    modal.header = '카테고리 추가';
    modal.open();
    modal.buttons = [
      {
        children: 'Cancel',
        onClick: () => {
          modal.close();
        },
      },
      {
        children: 'Create',
        onClick: () => {
          createCategoryItem();
        },
      },
    ];
  };

  return {
    onClickNew,
    onClickCategoryItem,
  };
};
