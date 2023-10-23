import { useMutation } from '@apollo/client';
import { DELETE_CATEGORY, GET_CATEGORIES } from '@gqls';

export const useDeleteCategory = () => {
  return useMutation(DELETE_CATEGORY, {
    refetchQueries: [GET_CATEGORIES, 'Category'],
  });
};
