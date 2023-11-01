import { useMutation } from '@apollo/client';
import { GET_CATEGORIES, UPDATE_CATEGORY } from '@gqls';
import { MutationOptions } from '../../../types/hooks/types';

export const useUpdateCategory = (options: MutationOptions) => {
  return useMutation(UPDATE_CATEGORY, {
    refetchQueries: [GET_CATEGORIES, 'Category'],
    onCompleted: () => {
      options.onCompleted && options.onCompleted();
    },
  });
};
