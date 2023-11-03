import { useCoCRouter } from '@hooks';
import { useParams, useSearchParams } from 'next/navigation';
import { useMutations } from './useMutations';
import { useStates } from './useStates';

export const useHandlers = (
  context: ReturnType<typeof useMutations> & ReturnType<typeof useStates>,
) => {
  const { createCategoryItem, updateCategoryItem, formState } = context;
  const { categoryItemId } = useParams();
  const searchParams = useSearchParams();
  const router = useCoCRouter();

  const onClickSave = async () => {
    const parentIds = JSON.parse(searchParams.get('parentIds') || '') || [];
    const parentId = categoryItemId as string;

    if (categoryItemId === 'new') {
      return await createCategoryItem({
        variables: {
          createCategoryItemInput: {
            ancestorIds: parentIds,
            name: formState.name,
            parentId: parentId,
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
