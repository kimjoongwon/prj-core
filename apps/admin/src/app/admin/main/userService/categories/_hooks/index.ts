import { useHandlers } from './useHandlers';
import { useProps } from './useProps';
import { useQueries } from './useQueries';

export const useCategoriesPage = () => {
  const queries = useQueries();
  const props = useProps({ queries });
  const handlers = useHandlers({ queries, props });

  return {
    ...props,
    ...handlers,
  };
};
