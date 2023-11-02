import { useCoCRouter } from '@hooks';
import { useParams } from 'next/navigation';
import { useMutations } from './useMutations';
import { useStates } from './useStates';

export const useHandlers = (
  context: ReturnType<typeof useMutations> & ReturnType<typeof useStates>,
) => {
  const { createCategoryItem, updateCategoryItem, formState } = context;
  const { categoryItemId } = useParams();
  const router = useCoCRouter();

  const onClickSave = async () => {
    if (categoryItemId === 'new') {
      return await createCategoryItem({
        variables: {
          createCategoryItemInput: {
            ancestorIds: formState.ancestorIds,
            name: formState.name,
            parentId: formState.parentId || '',
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
