import { useCategoryItemTreesQuery } from '@hooks';
import { useStates } from './useStates';
import { groupBy } from 'lodash-es';

export const useQueries = (states: ReturnType<typeof useStates>) => {
  const { parentIds } = states;
  const categoryItemTreesQuery = useCategoryItemTreesQuery();

  let categoryItemsGroupedByParentId = groupBy(
    categoryItemTreesQuery.data?.categoryItemTrees,
    'parentId',
  );

  const categoryItemTrees = Array.from(parentIds)?.map(parentId => {
    if (categoryItemsGroupedByParentId[parentId || 'null'] === undefined) {
      return [];
    }
    return categoryItemsGroupedByParentId[parentId || 'null'];
  });

  return {
    categoryItemTrees,
  };
};
