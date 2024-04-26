'use client';

import React, { useEffect } from 'react';
import {
  CategoryCard,
  CategoryDto,
  Container,
  CreateCategoryDto,
  List,
  useGetCategories,
} from '@shared/frontend';
import { observer } from 'mobx-react-lite';
import { groupBy, uniqueId } from 'lodash-es';
import { observable } from 'mobx';
import { useParams } from 'next/navigation';
import { navStore } from '@stores';

function Page() {
  return <CategoriesPage />;
}

export default observer(Page);

export const CategoriesPage = observer(() => {
  const {
    state,
    handlers: { onClickCard, onClickDetail },
  } = useCategoriesPage();

  return (
    <Container>
      <List
        horizontal
        data={state.categoryIds}
        renderItem={categoryId => (
          <List
            key={categoryId}
            data={state.categoriesGroupedByParentId?.[categoryId] || []}
            renderItem={category => (
              <CategoryCard
                key={uniqueId()}
                category={category}
                onClickCard={onClickCard}
                onClickDetail={onClickDetail}
              />
            )}
          />
        )}
      />
    </Container>
  );
});

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
