import { GetCategoryItemsQueryVariables } from '@__generated__/graphql';
import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr';
import { GET_CATEGORY_ITEMS } from '@gqls';

export const useCategoryItemsQuery = (
  variables: GetCategoryItemsQueryVariables,
) => {
  return useSuspenseQuery(GET_CATEGORY_ITEMS, {
    variables,
  });
};
