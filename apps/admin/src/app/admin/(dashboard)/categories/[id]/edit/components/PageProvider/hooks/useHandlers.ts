import { useCoCRouter } from '@hooks';
import { useMutations } from './useMutations';
import { useParams } from 'next/navigation';
import { CATEGORIES_PAGE_PATH } from '@constants';

export const useHandlers = (context: ReturnType<typeof useMutations>) => {
  const {
    createCategory: [createCategory],
    updateUser: [updateUser],
  } = context;

  const router = useCoCRouter();
  const { id } = useParams();

  const onClickSave = () => {
    if (id === 'new') {
      createCategory();
    } else {
      updateUser();
    }
    router.replace({ url: CATEGORIES_PAGE_PATH });
  };

  const onClickCancel = () => {
    router.push({
      url: '/admin/categories/:id',
    });
  };

  return {
    onClickSave,
    onClickCancel,
  };
};
