import { useMeta } from './useMeta';
import { useQueries } from './useQueries';
import { useHandlers } from './useHandlers';

export const useCategoryPage = () => {
  const queries = useQueries();
  const handlers = useHandlers({
    queries,
  });
  const { leftButtons, rightButtons } = useMeta({
    handlers,
  });

  return {
    category: queries.category,
    leftButtons,
    rightButtons,
    isLoading: queries.isGetCategoryByIdLoading,
  };
};
