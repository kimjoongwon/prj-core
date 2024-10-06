import { groupBy, isEmpty } from 'lodash-es';
import { useQueries } from './useQueries';
import { useState } from './useState';
import { useParams } from 'next/navigation';
import { ServiceDto } from '@shared/frontend';

export const useProps = ({
  state,
  queries,
}: {
  state: ReturnType<typeof useState>;
  queries: ReturnType<typeof useQueries>;
}) => {
  const { serviceId } = useParams();
  const { categories } = queries;

  const selectedCategory = state.selectedCategory;

  let relatedCategoryIds = ['null'];

  if (!isEmpty(selectedCategory)) {
    relatedCategoryIds.push(...(selectedCategory.ancestorIds || []));
    relatedCategoryIds.push(selectedCategory?.id);
  }

  const categoriesByFilteredByServiceId = categories?.filter(
    category => category.serviceId === serviceId,
  );

  return {
    categoriesGroupedByParentId: groupBy(categories, 'parentId'),
    relatedCategoryIds,
    categoriesByFilteredByServiceId,
  };
};

const getUserService = (services: ServiceDto[]) => {
  return services?.find(service => service.name === 'USER');
};
