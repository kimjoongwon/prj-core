import { GetCategoryFormQueryVariables } from '@__generated__/graphql';
import { skipToken, useSuspenseQuery } from '@apollo/client';
import { GET_CATEGORY_FORM } from '@gqls';

export const useCategoryFormQuery = (
  variables: GetCategoryFormQueryVariables,
) => {
  return useSuspenseQuery(
    GET_CATEGORY_FORM,
    variables.id === 'new' ? { variables } : skipToken,
  );
};
