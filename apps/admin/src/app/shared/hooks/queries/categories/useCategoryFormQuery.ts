import { useSuspenseQuery } from '@apollo/client';
import { GET_CATEGORY_FORM } from '@gqls';
import { GetCategoryFormQueryVariables } from '@__generated__/graphql';

export const useCategoryFormQuery = (
  variables: GetCategoryFormQueryVariables,
) => {
  return useSuspenseQuery(GET_CATEGORY_FORM, {
    variables,
    fetchPolicy: 'cache-and-network',
  });
};
