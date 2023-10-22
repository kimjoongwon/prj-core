import { useCoCRouter } from '@hooks';
import { useMutations } from './useMutations';
import { useParams } from 'next/navigation';

export const useHandlers = (context: ReturnType<typeof useMutations>) => {
  const {
    createCategory: [createCategory],
    updateCategory: [updateCategory],
  } = context;

  const router = useCoCRouter();
  const { id } = useParams();

  const onClickSave = () => {
    if (id === 'new') {
      createCategory();
    } else {
      updateCategory();
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
