import { useMutation } from '@apollo/client';
import { CREATE_CATEGORY } from '@gqls';
import { CreateCategoryMutationVariables } from '@__generated__/graphql';
import { MutationOptions } from '../types';

export const useCreateCategory = (
  variables: CreateCategoryMutationVariables,
  options: MutationOptions,
) => {
  return useMutation(CREATE_CATEGORY, {
    variables,
    onCompleted: () => {
      options.onCompleted && options.onCompleted();
    },
  });
};
