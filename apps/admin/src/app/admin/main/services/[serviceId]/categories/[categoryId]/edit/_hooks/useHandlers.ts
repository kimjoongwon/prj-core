import { myUniv } from '@shared/frontend';

import { useContext } from './useContext';
import { useQueries } from './useQueries';
import { useState } from './useState';

export const useHandlers = (context: {
  queries: ReturnType<typeof useQueries>;
  state: ReturnType<typeof useState>;
  context: ReturnType<typeof useContext>;
}) => {
  const {
    state,
    queries: { updateCategory, createCategory },
    context: { categoryId, isEditMode },
  } = context;

  const editNew = () => updateCategory({ categoryId, data: state.category! });

  const edit = () => createCategory({ data: state.category! });

  const onClickSave = () => {
    isEditMode ? editNew() : edit();

    myUniv.router.back();
  };

  const onClickCancel = () => {
    myUniv?.router.back();
  };

  return {
    onClickSave,
    onClickCancel,
  };
};
