import { useMutation } from '@apollo/client';
import { UPDATE_CATEGORY_ITEM } from '../../../gqls/mutations';
import { MutationOptions } from '@types';
import { GET_CATEGORY_ITEM_TREES } from '../../../gqls/queries';

export const useUpdateCategoryItem = (options: MutationOptions) => {
  return useMutation(UPDATE_CATEGORY_ITEM, {
    refetchQueries: [GET_CATEGORY_ITEM_TREES, 'CategoryItem'],
    onCompleted: () => {
      options.onCompleted && options.onCompleted();
    },
  });
};
