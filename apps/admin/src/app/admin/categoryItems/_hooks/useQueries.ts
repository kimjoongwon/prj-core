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
    if (categoryItemsGroupedByParentId[String(parentId)] === undefined) {
      return [];
    }
    return categoryItemsGroupedByParentId[String(parentId)];
  });

  return {
    categoryItemTrees,
  };
};
