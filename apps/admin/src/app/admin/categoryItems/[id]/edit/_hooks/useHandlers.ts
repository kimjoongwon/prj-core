import { useParams } from 'next/navigation';
import { useMutations } from './useMutations';

export const useHandlers = (context: ReturnType<typeof useMutations>) => {
  const { createCategoryItem, deleteCategoryItem, updateCategoryItem } =
    context;
  const { id } = useParams();
  const onClickSave = async () => {
    if (id === 'new') {
    }
  };
  const onClickCancel = () => {};
};
