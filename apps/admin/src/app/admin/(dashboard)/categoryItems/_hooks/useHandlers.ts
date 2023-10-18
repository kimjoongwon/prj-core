import { useCreateCategoryItem, useModal } from '@hooks';
import { useState } from './useState';

export const useHandlers = (state: ReturnType<typeof useState>) => {
  const modal = useModal();

  const [createCategoryItem] = useCreateCategoryItem({
    createCategoryItemInput: state.form,
  });

  return {
    onClickNew: (parentId: string) => {
      modal.open();
      state.form.parentId = parentId;
      createCategoryItem();
    },
  };
};
