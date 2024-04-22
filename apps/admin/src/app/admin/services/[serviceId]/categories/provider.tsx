import { CategoryDto, useGetCategories } from '@shared/frontend';
import { makeAutoObservable } from 'mobx';
import React from 'react';

export class CategoryPage {
  categories: Category[] = [];
  constructor() {
    makeAutoObservable(this);
  }

  setCategories(categories: Category[]) {
    this.categories = categories;
  }
}

export class Category implements CategoryDto {
  state: {
    categoryPage: CategoryPage | null;
    open: boolean;
  } = {
    categoryPage: null,
    open: false,
  };
  id: string = '';
  ancestorIds: string[] = [];
  createdAt: string = '';
  deletedAt: string | null = null;
  name: string = '';
  parentId: string | null = null;
  serviceId: string = '';
  spaceId: string = '';
  updatedAt: string | null = '';

  constructor(category: CategoryDto, categoryPage: CategoryPage) {
    Object.assign(this, category);
    this.state.categoryPage = categoryPage;
    makeAutoObservable(this);
  }

  open() {
    this.state.categoryPage?.categories.forEach(category => {
      console.log(category.id);
      if (category.id === this.id) {
        category.state.open = true;
      } else {
        category.state.open = false;
      }
    });
  }
}

interface CategoryPageContextValue {
  state: {
    categoryPage: CategoryPage | null;
  };
}

export const CategoryPageContext =
  React.createContext<CategoryPageContextValue>({} as CategoryPageContextValue);

export const useCategoryPage = () => {
  const state = React.useContext(CategoryPageContext);
  if (!state) {
    throw new Error(
      'useCategoryPage must be used within a CategoryPageProvider',
    );
  }
  return state;
};

interface CategoryPageProviderProps {
  children: React.ReactNode;
}

export const CategoriesPageProvider = (props: CategoryPageProviderProps) => {
  const { data: queryData, isLoading } = useGetCategories();

  const categoryPage = new CategoryPage();

  const categories = queryData?.data.map(
    category => new Category(category, categoryPage),
  );

  categoryPage.setCategories(categories || []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <CategoryPageContext.Provider
      value={{
        state: {
          categoryPage,
        },
      }}
    >
      {props.children}
    </CategoryPageContext.Provider>
  );
};
