'use client';

import React from 'react';
import { Button, Spacer } from '@nextui-org/react';
import {
  Container,
  HStack,
  Input,
  VStack,
  getGetCategoriesQueryKey,
  useCreateCategory,
} from '@shared/frontend';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useQueryClient } from '@tanstack/react-query';
import {
  CategoriesPageProvider,
  Category,
  useCategoriesPage,
} from './provider';

interface CategoryProps {
  category: Category;
}

function Page() {
  return (
    <CategoriesPageProvider>
      <CategoriesPage />
    </CategoriesPageProvider>
  );
}

export default observer(Page);

export const CategoriesPage = observer(() => {
  const state = useCategoriesPage();
  const ancestorIds = state.openedCategory?.ancestorIds || [];
  const categoryIds = ['null', ...ancestorIds, state.openedCategory.id];
  return (
    <Container>
      <CategoryForm />
      <Spacer y={2} />
      <CategoryContainer>
        {/* <CategorySection>
          {state.categoriesGroupedByParentId?.['null']?.map(category => {
            return <CategoryCard category={category} />;
          })}
        </CategorySection> */}
        {categoryIds?.map(ancestorId => {
          return (
            <CategorySection>
              {state.categoriesGroupedByParentId?.[ancestorId]?.map(
                category => {
                  return <CategoryCard category={category} />;
                },
              )}
            </CategorySection>
          );
        })}
        {/* <CategorySection>
          {state.categoriesGroupedByParentId?.[state.openedCategory.id]?.map(
            category => {
              return <CategoryCard category={category} />;
            },
          )}
        </CategorySection> */}
      </CategoryContainer>
    </Container>
  );
});

interface FinderProps {
  children: React.ReactNode;
}

interface FinderSection {
  children: React.ReactNode;
}

export const CategoryContainer = observer((props: FinderProps) => {
  const { children } = props;
  return <HStack className="gap-2">{children}</HStack>;
});

export const CategorySection = observer((props: FinderSection) => {
  const { children } = props;
  return <VStack className="gap-2">{children}</VStack>;
});

export const CategoryCard = observer((props: CategoryProps) => {
  const { category } = props;
  const onClickCategoryCard = () => category.open();
  return (
    <Button
      variant="ghost"
      color={category.state.open ? 'primary' : 'default'}
      onClick={onClickCategoryCard}
    >
      {category?.name}
    </Button>
  );
});

export const CategoryForm = observer(() => {
  const state = useCategoriesPage();
  const queryClient = useQueryClient();
  const { mutate } = useCreateCategory({
    mutation: {
      onSuccess: () => {
        const queryKey = getGetCategoriesQueryKey();

        queryClient.invalidateQueries({
          queryKey,
        });
      },
    },
  });

  const _state = useLocalObservable(() => ({
    test: '',
  }));

  const onClickCreateCategory = () => {
    const { form } = state;

    mutate({
      data: {
        ancestorIds: [
          ...state.openedCategory?.ancestorIds,
          state.openedCategory.id,
        ],
        name: form.name,
        parentId: state.openedCategory.id,
        serviceId: state.openedCategory.serviceId,
        spaceId: state.openedCategory.spaceId,
      },
    });
  };

  console.log(_state.test);
  return (
    <HStack>
      <Input placeholder="카테고리명" state={_state} path="test" />
      <Spacer x={3} />
      <Button onClick={onClickCreateCategory}>생성</Button>
    </HStack>
  );
});
