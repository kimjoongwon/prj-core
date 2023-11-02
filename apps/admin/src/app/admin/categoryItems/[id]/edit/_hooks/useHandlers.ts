import { useCoCRouter } from '@hooks';
import { useParams } from 'next/navigation';
import { useMutations } from './useMutations';
import { useStates } from './useStates';

export const useHandlers = (
  context: ReturnType<typeof useMutations> & ReturnType<typeof useStates>,
) => {
  const { createCategoryItem, updateCategoryItem, formState } = context;
  const { id } = useParams();
  const router = useCoCRouter();

  const onClickSave = async () => {
    if (id === 'new') {
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
          id: id as string,
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
