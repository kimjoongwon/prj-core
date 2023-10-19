import { MutationCreateCategoryItemArgs } from '@__generated__/graphql';
import { useMutation } from '@apollo/client';
import { CREATE_CATEGORY_ITEM, GET_CATEGORY_ITEM_TREES } from '@gqls';

export const useCreateCategoryItem = (
  variables: MutationCreateCategoryItemArgs,
) => {
  return useMutation(CREATE_CATEGORY_ITEM, {
    variables,
    refetchQueries: [GET_CATEGORY_ITEM_TREES, 'CategoryItem'],
  });
};
