import { useCreateCategoryItem } from '@hooks';
import { useState } from './useState';

export const useHandlers = (state: ReturnType<typeof useState>) => {
  const [createCategoryItem] = useCreateCategoryItem({
    createCategoryItemInput: state.form,
  });

  return {
    onClickNew: (parentId: string) => {
      state.form.parentId = parentId;
      createCategoryItem();
    },
  };
};
