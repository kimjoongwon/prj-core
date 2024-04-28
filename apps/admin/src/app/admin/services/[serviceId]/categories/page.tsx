'use client';

import React, { useCallback } from 'react';
import {
  CategoryCard,
  CategoryDto,
  Container,
  CreateCategoryDto,
  List,
  getGetAllServiceQueryKey,
  useCreateCategory,
  useGetCategories,
} from '@shared/frontend';
import { observer } from 'mobx-react-lite';
import { cloneDeep, groupBy, uniqueId } from 'lodash-es';
import { observable } from 'mobx';
import { useParams } from 'next/navigation';
import { router } from '@shared/frontend';
import { useQueryClient } from '@tanstack/react-query';

function Page() {
  return <CategoriesPage />;
}

export default observer(Page);

export const CategoriesPage = observer(() => {
  const {
    onClickCard,
    onClickDetail,
    onClickCreate,
    categoriesGroupedByParentId,
    relatedCategoryIds,
  } = useCategoriesPage();

  return (
    <Container>
      <List
        horizontal
        data={relatedCategoryIds}
        renderItem={categoryId => (
          <List
            key={categoryId}
            data={categoriesGroupedByParentId?.[categoryId] || []}
            renderItem={category => (
              <CategoryCard
                key={uniqueId()}
                category={category}
                onClickCard={onClickCard}
                onClickDetail={onClickDetail}
                onClickCreate={onClickCreate}
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
}

export const useCategoriesPage = () => {
  const queries = useQueries();
  const state = useState({ queries });
  const props = useProps({ state });
  const handlers = useHandlers({ state, queries });

  return {
    ...props,
    ...handlers,
  };
};

const useProps = ({ state }: { state: ReturnType<typeof useState> }) => {
  const untrackedState = cloneDeep(state);

  const categoriesByParentId = groupBy(untrackedState.categories, 'parentId');
  const openedCategory = untrackedState.openedCategory;
  let relatedCategoryIds = ['null'];

  if (openedCategory) {
    relatedCategoryIds.push(...(openedCategory.ancestorIds || []));
    relatedCategoryIds.push(openedCategory.id);
  }

  return {
    categoriesGroupedByParentId: categoriesByParentId,
    relatedCategoryIds,
  };
};

const useQueries = () => {
  const { data: queryData, isLoading } = useGetCategories();
  const { mutateAsync: createCategory, isSuccess } = useCreateCategory();
  return {
    isSuccess,
    createCategory,
    categories: queryData?.data,
    isLoading,
  };
};

const useState = (props: { queries: ReturnType<typeof useQueries> }) => {
  const {
    queries: { categories },
  } = props;

  const state: State = observable({
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

  return state;
};

const useHandlers = (props: {
  state: ReturnType<typeof useState>;
  queries: ReturnType<typeof useQueries>;
}) => {
  const {
    state,
    queries: { createCategory },
  } = props;
  const { serviceId } = useParams();

  const queryClient = useQueryClient();

  const categoriesGroupedByParentId = groupBy(state.categories, 'parentId');

  const onClickDetail = (category: CategoryDto) => {
    router.push({
      url: '/admin/services/:serviceId/categories/:categoryId',
      params: {
        categoryId: category.id,
        serviceId,
      },
    });
  };

  const onClickCard = (category: CategoryDto) => {
    const categoriesByParentId =
      categoriesGroupedByParentId?.[category.parentId!];

    categoriesByParentId?.forEach(_category => {
      if (_category.id === category.id) {
        state.openedCategory = category;

        if (category.id) {
          throw new Error('Category ID is required');
        }

        if (!serviceId) {
          throw new Error('Service ID is required');
        }

        router.push({
          url: '/admin/services/:serviceId/categories/:categoryId/edit',
          params: {
            categoryId: category.id,
            serviceId,
          },
        });
      }
    });
  };

  const onClickCreate = async (category: CategoryDto) => {
    state.form.parentId = category.id;

    await createCategory({
      data: state.form,
    });

    queryClient.invalidateQueries({
      queryKey: getGetAllServiceQueryKey(),
    });
  };

  return {
    onClickCreate,
    onClickDetail: useCallback(onClickDetail, [serviceId]),
    onClickCard: useCallback(onClickCard, [categoriesGroupedByParentId]),
  };
};
