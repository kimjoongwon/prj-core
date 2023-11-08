import { useCoCRouter } from '@hooks';
import { useMutations } from './useMutations';
import { useParams } from 'next/navigation';
import { useState } from './useState';

export const useHandlers = ({
  mutations,
  state,
}: {
  mutations: ReturnType<typeof useMutations>;
  state: ReturnType<typeof useState>;
}) => {
  const {
    createCategory: [createCategory],
    updateCategory: [updateCategory],
  } = mutations;

  const router = useCoCRouter();
  const { categoryId } = useParams();

  const onClickSave = () => {
    if (categoryId === 'new') {
      createCategory({
        variables: {
          createCategoryInput: {
            name: state.form.name,
            itemId: state.form.itemId,
            serviceId: state.form.serviceId,
          },
        },
      });
    } else {
      updateCategory({
        variables: {
          updateCategoryInput: {
            id: categoryId as string,
            name: state.form.name,
            itemId: state.form.itemId,
            serviceId: state.form.serviceId,
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
