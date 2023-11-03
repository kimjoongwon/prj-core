import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr';
import { GET_CATEGORY_ITEM_TREES } from '@gqls';
import { GetCategoryItemTreesQueryVariables } from '@__generated__/graphql';

export const useCategoryItemTreesQuery = () => {
  return useSuspenseQuery(GET_CATEGORY_ITEM_TREES, {
    fetchPolicy: 'cache-and-network',
  });
};
