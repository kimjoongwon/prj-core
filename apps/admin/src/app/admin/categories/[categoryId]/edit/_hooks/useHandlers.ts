import { useCoCRouter } from '@hooks';
import { useMutations } from './useMutations';
import { useParams } from 'next/navigation';
import { useStates } from './useStates';

export const useHandlers = (
  context: ReturnType<typeof useMutations> & ReturnType<typeof useStates>,
) => {
  const {
    formState,
    createCategory: [createCategory],
    updateCategory: [updateCategory],
  } = context;

  const router = useCoCRouter();
  const { categoryId } = useParams();

  const onClickSave = () => {
    if (categoryId === 'new') {
      createCategory({
        variables: {
          createCategoryInput: {
            name: formState.name,
            categoryItemId: formState.categoryItemId,
            serviceId: formState.serviceId,
          },
        },
      });
    } else {
      updateCategory({
        variables: {
          updateCategoryInput: {
            id: categoryId as string,
            name: formState.name,
            categoryItemId: formState.categoryItemId,
            serviceId: formState.serviceId,
          },
        },
      });
    }
  };

  const onClickCancel = () => {
    router.back();
  };

  return {
    onClickSave,
    onClickCancel,
  };
};
