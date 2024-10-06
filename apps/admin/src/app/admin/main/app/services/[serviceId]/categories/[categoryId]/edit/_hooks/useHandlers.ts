import { CreateCategoryDto, galaxy } from '@shared/frontend';

import { useContext } from './useContext';
import { useQueries } from './useQueries';
import { useState } from './useState';
import { useMutations } from './useMutations';

export const useHandlers = (context: {
  state: ReturnType<typeof useState>;
  context: ReturnType<typeof useContext>;
  mutations: ReturnType<typeof useMutations>;
}) => {
  const {
    state,
    mutations: { updateCategory, createCategory },
    context: { categoryId, isEditMode },
  } = context;

  const editNew = () =>
    createCategory.mutate({ data: state.categoryForm as CreateCategoryDto });

  const edit = () =>
    updateCategory.mutate({ categoryId, data: state.categoryForm });

  const onClickSave = () => {
    !isEditMode ? editNew() : edit();

    galaxy.router.back();
  };

  const onClickCancel = () => {
    galaxy?.router.back();
  };

  return {
    onClickSave,
    onClickCancel,
  };
};
