import { CategoryDto, CreateCategoryDto } from '@shared/frontend';
import { groupBy } from 'lodash-es';
import { extendObservable, observable } from 'mobx';
import { useGetCategories } from '@shared/frontend';
import { navStore } from '../../../../shared/stores/navStore';
import { useParams } from 'next/navigation';

interface CategoryPage {
  categories: CategoryDto[];
  openedCategory: CategoryDto;
  form: CreateCategoryDto;
}

export const useCategoriesPage = () => {
  const queries = useQueries();
  const state = useState(queries);
  const handlers = useHandlers();

  return {
    queries,
    state,
    handlers,
  };
};

const useQueries = () => {
  const { data: queryData, isLoading } = useGetCategories();
  return {
    categories: queryData?.data,
    isLoading,
  };
};

const useState = (props: ReturnType<typeof useQueries>) => {
  const { categories } = props;
  const state: CategoryPage = observable({
    categories: categories || [],
    openedCategory: {} as CategoryDto,
    form: {
      name: '',
      ancestorIds: [],
      parentId: null,
      serviceId: '',
      spaceId: '',
    },
  });

  const ancestorIds = state.openedCategory?.ancestorIds || [];

  const extendState = extendObservable(state, {
    ancestorIds,
    categoryIds: ['null', ...ancestorIds, state.openedCategory.id],
    categoriesGroupedByParentId: groupBy(state.categories, 'parentId'),
  });

  return extendState;
};

const useHandlers = () => {
  const { serviceId } = useParams();
  return {
    onClickCard: (category: CategoryDto) => {
      navStore.push({
        url: '/admin/services/:serviceId/categories/:categoryId',
        params: {
          categoryId: category.id,
          serviceId,
        },
      });
    },
  };
};
