import { skipToken } from '@apollo/client';
import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr';
import { GET_CATEGORY_ITEM } from '@gqls';
import { GetCategoryItemQueryVariables } from '@__generated__/graphql';

export const useCategoryItemQuery = (
  variables: GetCategoryItemQueryVariables,
) => {
  return useSuspenseQuery(
    GET_CATEGORY_ITEM,
    variables.id === 'new'
      ? skipToken
      : {
          variables,
          fetchPolicy: 'cache-and-network',
        },
  );
};
