import { useMutation } from '@apollo/client';
import { GET_CATEGORIES, REMOVE_CATEGORY } from '@gqls';

export const useRemoveCategory = () => {
  return useMutation(REMOVE_CATEGORY, {
    refetchQueries: [GET_CATEGORIES, 'Category'],
  });
};
