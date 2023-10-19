import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr';
import { GET_CATEGORY_ITEM_TREES } from '@gqls';

export const useCategoryItemTreesQuery = (parentIds: string[]) => {
  return useSuspenseQuery(GET_CATEGORY_ITEM_TREES, {
    variables: {
      parentIds,
    },
    fetchPolicy: 'cache-and-network',
  });
};
