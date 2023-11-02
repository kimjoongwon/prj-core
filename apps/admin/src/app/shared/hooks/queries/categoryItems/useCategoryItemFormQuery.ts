import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr';
import { GET_CATEGORY_ITEM_FORM } from '@gqls';
import { GetCategoryItemFormQueryVariables } from '@__generated__/graphql';

export const useCategoryItemFormQuery = (
  variables: GetCategoryItemFormQueryVariables,
) => {
  return useSuspenseQuery(GET_CATEGORY_ITEM_FORM, {
    variables,
    fetchPolicy: 'cache-and-network',
  });
};
