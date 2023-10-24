import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr';
import { GET_CATEGORY_ITEM } from '@gqls';

export const useCategoryItemQuery = () => {
  return useSuspenseQuery(GET_CATEGORY_ITEM);
};
