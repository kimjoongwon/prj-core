import { useMutation } from '@apollo/client';
import { CREATE_CATEGORY_ITEM, GET_CATEGORY_ITEM_TREES } from '@gqls';
import { MutationOptions } from '@types';

export const useCreateCategoryItem = (options: MutationOptions) => {
  return useMutation(CREATE_CATEGORY_ITEM, {
    refetchQueries: [GET_CATEGORY_ITEM_TREES, 'GetCategoryItemTrees'],
    onCompleted: () => {
      options.onCompleted && options.onCompleted();
    },
  });
};
