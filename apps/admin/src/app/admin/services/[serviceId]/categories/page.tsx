'use client';

import React from 'react';
import { Button, Spacer } from '@nextui-org/react';
import {
  Container,
  HStack,
  Input,
  VStack,
  authStore,
  getGetCategoriesQueryKey,
  useCreateCategory,
} from '@shared/frontend';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useParams } from 'next/navigation';
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
  console.log(state.categoryPage?.categoriesGroupedByParentId);
  return (
    <Container>
      <CategoryForm />
      <Spacer y={2} />
      <CategoryContainer>
        <CategorySection>
          {state.categoryPage?.categoriesGroupedByParentId['null'].map(
            category => {
              return <CategoryCard category={category} />;
            },
          )}
        </CategorySection>
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

export const CategoryForm = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
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

  const state = useLocalObservable(() => ({
    name: '',
  }));

  const onClickCreateCategory = () => {
    mutate({
      data: {
        parentId: null,
        ancestorIds: [],
        spaceId: authStore.currentTenant?.id || '',
        serviceId,
        name: state.name,
      },
    });
  };

  return (
    <HStack>
      <Input placeholder="카테고리명" state={state} path="name" />
      <Spacer x={3} />
      <Button onClick={onClickCreateCategory}>생성</Button>
    </HStack>
  );
};
