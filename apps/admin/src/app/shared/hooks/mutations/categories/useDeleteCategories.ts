import { useMutation } from '@apollo/client';
import { DELETE_CATEGORIES, GET_CATEGORIES } from '@gqls';

export const useDeleteCategories = () => {
  return useMutation(DELETE_CATEGORIES, {
    refetchQueries: [GET_CATEGORIES, 'Category'],
  });
};
