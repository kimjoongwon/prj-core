import { useQueries } from './useQueries';
import { useHandlers } from './useHandlers';

export const useMeta = (
  context: ReturnType<typeof useQueries> & ReturnType<typeof useHandlers>,
) => {
  const { categoryItemTrees, onClickNew, onClickCategoryItem } = context;

  return {
    section: {
      categoryItem: {
        onClickCategoryItem,
      },
      header: {
        name: '카테고리',
        onClickNew,
      },
      categoryItemTrees,
    },
  };
};
