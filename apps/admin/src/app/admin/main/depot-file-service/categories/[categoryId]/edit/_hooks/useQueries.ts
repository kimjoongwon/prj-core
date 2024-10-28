import { useGetCategoryByIdSuspense } from '@shared/frontend';
import { useContext } from './useContext';

interface Props {
  context: ReturnType<typeof useContext>;
}

export const useQueries = (props: Props) => {
  const {
    context: { categoryId },
  } = props;
  return {
    getCategoryById: useGetCategoryByIdSuspense(categoryId),
  };
};
