import { skipToken } from '@apollo/client';
import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr';
import { GET_CATEGORY } from '@gqls';
import { GetCategoryQueryVariables } from '@__generated__/graphql';

export const useCategoryQuery = (variables: GetCategoryQueryVariables) => {
  return useSuspenseQuery(
    GET_CATEGORY,
    variables.id === 'new' ? skipToken : { variables },
  );
};
