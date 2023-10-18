import { groupBy } from 'lodash-es';
import { useQueries } from './useQueries';
import { useHandlers } from './useHandlers';

export const useMeta = (
  context: ReturnType<typeof useQueries> & ReturnType<typeof useHandlers>,
) => {
  const { categoryItemTrees, onClickNew } = context;

  return {
    section: {
      header: {
        name: '카테고리',
        button: {
          onClickNew,
        },
      },
      categoryItemTrees,
    },
  };
};
