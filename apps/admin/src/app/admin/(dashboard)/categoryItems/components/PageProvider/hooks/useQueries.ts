import { useCategoryItemTreesQuery } from '@hooks';
import { useState } from './useState';
import { groupBy } from 'lodash-es';

export const useQueries = (state: ReturnType<typeof useState>) => {
  const parentIds = state.parentIds;

  const categoryItemTreesQuery = useCategoryItemTreesQuery(parentIds);
  console.log(categoryItemTreesQuery.data?.categoryItemTrees);

  let categoryItemsGroupedByParentId = groupBy(
    categoryItemTreesQuery.data?.categoryItemTrees,
    'parentId',
  );

  const categoryItemTrees = parentIds.map(parentId => {
    if (categoryItemsGroupedByParentId[parentId] === undefined) {
      return [];
    }
    return categoryItemsGroupedByParentId[parentId];
  });

  return {
    categoryItemTrees,
  };
};
