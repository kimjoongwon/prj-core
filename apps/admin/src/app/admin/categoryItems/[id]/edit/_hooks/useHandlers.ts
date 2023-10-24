import { useCoCRouter } from '@hooks';
import { useParams } from 'next/navigation';
import { useMutations } from './useMutations';
import { useState } from './useStates';

export const useHandlers = (
  context: ReturnType<typeof useMutations> & ReturnType<typeof useState>,
) => {
  const {
    createCategoryItem,
    updateCategoryItem,
    createCategoryItemInput,
    updateCategoryItemInput,
  } = context;
  const { id } = useParams();
  const router = useCoCRouter();

  const onClickSave = async () => {
    if (id === 'new') {
      return await createCategoryItem({
        variables: {
          createCategoryItemInput,
        },
      });
    }
    return await updateCategoryItem({
      variables: {
        updateCategoryItemInput,
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
