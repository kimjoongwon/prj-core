import { groupBy, isEmpty } from 'lodash-es';
import { useQueries } from './useQueries';
import { useState } from './useState';
import { ServiceEntity } from '@shared/frontend';

export const useProps = ({
  state,
  queries,
}: {
  state: ReturnType<typeof useState>;
  queries: ReturnType<typeof useQueries>;
}) => {
  const { categories, services } = queries;
  
  const selectedCategory = state.selectedCategory;
  
  let relatedCategoryIds = ['null'];

  if (!isEmpty(selectedCategory)) {
    relatedCategoryIds.push(...(selectedCategory.ancestorIds || []));
    relatedCategoryIds.push(selectedCategory?.id);
  }

  const service = getUserService(services);

  const categoriesByFilteredByServiceId = categories?.filter(
    category => category.serviceId === service?.id,
  );

  return {
    categoriesGroupedByParentId: groupBy(categories, 'parentId'),
    relatedCategoryIds,
    categoriesByFilteredByServiceId,
  };
};

const getUserService = (services: ServiceEntity[]) => {
  return services?.find(service => service.name === 'USER');
};
