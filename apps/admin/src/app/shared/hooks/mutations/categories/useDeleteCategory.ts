import { useMutation } from '@apollo/client';
import { DELETE_CATEGORY, GET_CATEGORIES } from '@gqls';
import { DeleteCategoryMutationVariables } from '@__generated__/graphql';
import { MutationOptions } from '../types';

export const useDeleteCategory = (
  variables: DeleteCategoryMutationVariables,
  options: MutationOptions,
) => {
  return useMutation(DELETE_CATEGORY, {
    variables,
    refetchQueries: [GET_CATEGORIES, 'Category'],
    onCompleted: () => {
      options.onCompleted && options.onCompleted();
    },
  });
};
