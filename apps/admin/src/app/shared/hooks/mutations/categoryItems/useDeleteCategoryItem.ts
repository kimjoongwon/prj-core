import { useMutation } from '@apollo/client';
import { DELETE_CATEGORY_ITEM, GET_CATEGORY_ITEM_TREES } from '@gqls';
import { MutationOptions } from '@types';

export const useDeleteCategoryItem = (options: MutationOptions) => {
  return useMutation(DELETE_CATEGORY_ITEM, {
    refetchQueries: [GET_CATEGORY_ITEM_TREES, 'CategoryItem'],
    onCompleted: () => {
      options.onCompleted && options.onCompleted();
    },
  });
};
