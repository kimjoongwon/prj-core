import { myUniv } from '@shared/frontend';
import { useContext } from './useContext';
import { useQueries } from './useQueries';
import { useState } from './useState';
import { isEmpty } from 'lodash-es';

export const useHandlers = (context: {
  queries: ReturnType<typeof useQueries>;
  state: ReturnType<typeof useState>;
  context: ReturnType<typeof useContext>;
}) => {
  const {
    state,
    queries: {
      updateCategory,
      createCategory,
      userService,
      category,
      parentCategory,
    },
    context: { categoryId, isEditMode, isExistParentCategory },
  } = context;

  const onClickSave = async () => {
    if (isEditMode) {
      await updateCategory({
        categoryId,
        data: state.category!,
      });
      return;
    }

    const parentCategoryAncestorIds = parentCategory?.ancestorIds || [];
    const ancestorIds = parentCategory?.id
      ? parentCategoryAncestorIds.concat([parentCategory.id])
      : [];

    await createCategory({
      data: {
        name: state.category?.name || '',
        ancestorIds,
        parentId: parentCategory?.id || null,
        serviceId: userService?.id,
        spaceId: myUniv?.auth.currentSpaceId,
      },
    });

    myUniv?.router.back();
  };

  const onClickCancel = () => {
    myUniv?.router.back();
  };

  return {
    onClickSave,
    onClickCancel,
  };
};
