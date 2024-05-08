import { groupBy } from 'lodash-es';
import { useQueries } from './useQueries';
import { categroiesPageState } from './state';

export const useProps = ({
  queries,
}: {
  queries: ReturnType<typeof useQueries>;
}) => {
  const { categories } = queries;
  const categoriesByParentId = groupBy(categories, 'parentId');
  const openedCategory = categroiesPageState.openedCategory;
  let relatedCategoryIds = ['null'];

  relatedCategoryIds.push(...(openedCategory.ancestorIds || []));
  relatedCategoryIds.push(openedCategory.id);

  return {
    categoriesGroupedByParentId: categoriesByParentId,
    relatedCategoryIds,
  };
};
