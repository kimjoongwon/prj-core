import { useParams } from 'next/navigation';
import { useHandlers } from './useHandlers';
import { useState } from './useStates';

export const useMeta = (
  context: ReturnType<typeof useState> & ReturnType<typeof useHandlers>,
) => {
  const {
    createCategoryItemInput,
    onClickCancel,
    onClickSave,
    updateCategoryItemInput,
  } = context;
  const { id } = useParams();
  const isEditMode = id !== 'new';
  return {
    isEditMode,
    form: {
      state: {
        createCategoryItemInput,
        updateCategoryItemInput,
      },
      buttons: {
        onClickSave,
        onClickCancel,
      },
    },
  };
};
