import { galaxy } from '@shared/frontend';

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

  const edit = () => {};

  const onClickSave = () => {
    isEditMode ? editNew() : edit();

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
