import { useMutation } from '@apollo/client';
import { CreateCategoryMutationVariables } from '@__generated__/graphql';
import { CREATE_CATEGORY } from '@gqls';

export const useCreateCategory = (
  variables: CreateCategoryMutationVariables,
) => {
  return useMutation(CREATE_CATEGORY, {
    variables,
  });
};
