import { useCoCRouter } from '@hooks';
import { cloneDeep, isNull } from 'lodash-es';
import { useParams, useSearchParams } from 'next/navigation';
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
  const searchParams = useSearchParams();
  const onClickSave = async () => {
    const parentId = searchParams.get('parentId') || null;
    const ancestorIds = searchParams?.get('ancestorIds')
      ? searchParams?.get('ancestorIds')?.split(',') || []
      : [];
    const formState = cloneDeep(state.formState);
    if (categoryItemId === 'new') {
      return await createCategoryItem({
        variables: {
          createCategoryItemInput: {
            ancestorIds: ancestorIds,
            name: formState.name,
            parentId,
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
