import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr';
import { GET_CATEGORY_ITEM_FORM } from '@gqls';

export const useCategoryItemFormQuery = () => {
  return useSuspenseQuery(GET_CATEGORY_ITEM_FORM, {
    fetchPolicy: 'cache-and-network',
  });
};
