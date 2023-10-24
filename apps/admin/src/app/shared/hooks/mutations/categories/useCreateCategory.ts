import { useMutation } from '@apollo/client';
import { CREATE_CATEGORY, GET_CATEGORIES } from '@gqls';
import { CreateCategoryMutationVariables } from '@__generated__/graphql';
import { MutationOptions } from '../../../types/hooks/types';

export const useCreateCategory = (
  variables: CreateCategoryMutationVariables,
  options: MutationOptions,
) => {
  return useMutation(CREATE_CATEGORY, {
    variables,
    refetchQueries: [GET_CATEGORIES, 'categories'],
    onCompleted: () => {
      options.onCompleted && options.onCompleted();
    },
  });
};
