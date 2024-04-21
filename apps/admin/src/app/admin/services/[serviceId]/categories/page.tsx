'use client';

import React from 'react';
import { Button, ButtonProps, Spacer } from '@nextui-org/react';
import {
  CategoryDto,
  Container,
  HStack,
  Input,
  VStack,
  authStore,
  getGetCategoriesQueryKey,
  useCreateCategory,
  useGetCategories,
} from '@shared/frontend';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useParams } from 'next/navigation';
import { observable } from 'mobx';

interface CategoryPageProviderProps {
  children: React.ReactNode;
}

export interface CategoryPageState {
  categories: CategoryDto[];
}

export interface CategoryPageContextValue {
  state: CategoryPageState;
}

const CategoryPageContext = React.createContext<CategoryPageContextValue>(
  {} as CategoryPageContextValue,
);

const CategoryPageProvider = (props: CategoryPageProviderProps) => {
  const { data: queryData } = useGetCategories();
  const categories = queryData?.data || [];

  const state = observable({
    categories,
  });

  return (
    <CategoryPageContext.Provider
      value={{
        state,
      }}
    >
      {props.children}
    </CategoryPageContext.Provider>
  );
};

export const useCategoryPage = () => {
  const store = React.useContext(CategoryPageContext);
  if (!store) {
    throw new Error(
      'useCategoryPage must be used within a CategoryPageProvider',
    );
  }
  return store;
};

function Page() {
  return (
    <CategoryPageProvider>
      <CategoriesPage />
    </CategoryPageProvider>
  );
}

export default observer(Page);

export const CategoriesPage = observer(() => {
  const { data: qData } = useGetCategories();
  const categories = qData?.data || [];

  return (
    <Container>
      <CategoryForm />
      <Spacer y={2} />
      <Category>
        <CategorySection>
          {categories.map(category => {
            return <CategoryItem key={category.id} />;
          })}
        </CategorySection>
      </Category>
    </Container>
  );
});

interface FinderProps {
  children: React.ReactNode;
}

interface FinderSection {
  children: React.ReactNode;
}

export const Category = observer((props: FinderProps) => {
  const { children } = props;
  return <HStack className="gap-2">{children}</HStack>;
});

export const CategorySection = observer((props: FinderSection) => {
  const { children } = props;
  return <VStack className="gap-2">{children}</VStack>;
});

export const CategoryItemButton = observer((props: ButtonProps) => {
  const { children, ...rest } = props;
  return (
    <Button {...rest} variant="ghost">
      {children}
    </Button>
  );
});

export const CategoryItem = observer(() => {
  return <CategoryItemButton>CategoryItem</CategoryItemButton>;
});

export const CategoryForm = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const { mutate } = useCreateCategory({
    mutation: {
      onSuccess: () => {
        getGetCategoriesQueryKey();
      },
    },
  });

  const state = useLocalObservable(() => ({
    name: '',
  }));

  const onClickCreateCategory = () => {
    const user = authStore.user;

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
