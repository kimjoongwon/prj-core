import { useCoCRouter } from '@hooks';
import { cloneDeep } from 'lodash-es';
import { useParams } from 'next/navigation';
import { useCategoryItemsPage } from '../../../hooks';
import { useMutations } from './useMutations';
import { useState } from './useState';

export const useHandlers = (context: {
  state: ReturnType<typeof useState>;
  mutations: ReturnType<typeof useMutations>;
  categoryItemsPage: ReturnType<typeof useCategoryItemsPage>;
}) => {
  const {
    mutations: { createCategoryItem, deleteCategoryItem, updateCategoryItem },
    state,
    categoryItemsPage,
  } = context;

  const { categoryItemId } = useParams();
  const router = useCoCRouter();

  const onClickSave = async () => {
    const formState = cloneDeep(state.formState);
    const selectedCategoryItem = cloneDeep(
      categoryItemsPage.state.selectedCategoryItem,
    );
    console.log(selectedCategoryItem);
    if (categoryItemId === 'new') {
      if (!selectedCategoryItem) return null;

      return await createCategoryItem({
        variables: {
          createCategoryItemInput: {
            ancestorIds: [
              ...selectedCategoryItem.ancestorIds,
              selectedCategoryItem.id,
            ],
            name: formState.name,
            parentId: selectedCategoryItem.id,
            tag: formState.tag,
          },
        },
      });
    }
    return await updateCategoryItem({
      variables: {
        updateCategoryItemInput: {
          id: categoryItemId as string,
          ancestorIds: formState.ancestorIds || [],
          name: formState.name,
          parentId: formState.parentId || '',
          tag: formState.tag,
        },
      },
    });
  };

  const onClickCancel = () => {
    router.back();
  };

  return {
    onClickSave,
    onClickCancel,
  };
};
