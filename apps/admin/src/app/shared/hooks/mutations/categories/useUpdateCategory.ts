import { useMutation } from '@apollo/client';
import { GET_CATEGORIES, UPDATE_CATEGORY } from '@gqls';
import { UpdateCategoryMutationVariables } from '@__generated__/graphql';
import { MutationOptions } from '../../../types/hooks/types';

export const useUpdateCategory = (
  variables: UpdateCategoryMutationVariables,
  options: MutationOptions,
) => {
  return useMutation(UPDATE_CATEGORY, {
    variables,
    refetchQueries: [GET_CATEGORIES, 'Category'],
    onCompleted: () => {
      options.onCompleted && options.onCompleted();
    },
  });
};
