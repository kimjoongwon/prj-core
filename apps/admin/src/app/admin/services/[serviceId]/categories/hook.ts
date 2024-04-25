import { CategoryDto, CreateCategoryDto } from '@shared/frontend';
import { groupBy } from 'lodash-es';
import { observable } from 'mobx';
import { useGetCategories } from '@shared/frontend';
import { navStore } from '../../../../shared/stores/navStore';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

interface State {
  categories: CategoryDto[];
  openedCategory: CategoryDto;
  form: CreateCategoryDto;
  categoriesGroupedByParentId: Record<string, CategoryDto[]>;
  categoryIds: string[];
}

export const useCategoriesPage = () => {
  const queries = useQueries();
  const state = useState({ queries });
  const handlers = useHandlers({ state });

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

const state: State = observable({
  categories: [],
  openedCategory: {} as CategoryDto,
  form: {
    name: '',
    ancestorIds: [],
    parentId: null,
    serviceId: '',
    spaceId: '',
  },
  categoriesGroupedByParentId: {},
  categoryIds: [],
});

const useState = (props: { queries: ReturnType<typeof useQueries> }) => {
  const {
    queries: { categories },
  } = props;

  useEffect(() => {
    state.categories = categories || [];
    state.categoriesGroupedByParentId = groupBy(categories, 'parentId');
    state.categoryIds = [
      'null',
      ...(state.openedCategory.ancestorIds || []),
      state.openedCategory.id,
    ];
  }, [state.openedCategory.id]);

  return state;
};

const useHandlers = (props: { state: ReturnType<typeof useState> }) => {
  const { state } = props;
  const { serviceId } = useParams();
  return {
    onClickDetail: (category: CategoryDto) => {
      navStore.push({
        url: '/admin/services/:serviceId/categories/:categoryId',
        params: {
          categoryId: category.id,
          serviceId,
        },
      });
    },
    onClickCard: (category: CategoryDto) => {
      const categoriesByParentId =
        state.categoriesGroupedByParentId?.[category.parentId!];

      console.log('categoriesByParentId', categoriesByParentId);
      categoriesByParentId?.forEach(_category => {
        if (_category.id === category.id) {
          console.log('category', _category);
          state.openedCategory = category;
        }
      });
    },
  };
};
