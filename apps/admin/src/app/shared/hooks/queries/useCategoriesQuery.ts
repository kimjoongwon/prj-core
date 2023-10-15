import { GetCategoriesQueryVariables } from '@__generated__/graphql';
import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr';
import { GET_CATEGORIES } from '@gqls';

export const useCategoriesQuery = (variables: GetCategoriesQueryVariables) => {
  return useSuspenseQuery(GET_CATEGORIES, {
    variables,
  });
};
