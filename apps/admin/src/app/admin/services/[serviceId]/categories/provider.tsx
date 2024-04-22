import {
  CategoryDto,
  CategoryDtoParentId,
  useGetCategories,
} from '@shared/frontend';
import { makeAutoObservable } from 'mobx';
import React from 'react';

export class CategoryPage {
  categories: Category[] = [];
  constructor(categories: Category[]) {
    this.categories = categories;
    makeAutoObservable(this);
  }
}

export class Category implements CategoryDto {
  state = {
    open: false,
  };
  ancestorIds: string[] = [];
  createdAt: string = '';
  deletedAt: string | null = null;
  id: string = '';
  name: string = '';
  parentId: string | null = null;
  serviceId: string = '';
  spaceId: string = '';
  updatedAt: string | null = '';

  constructor(category: CategoryDto) {
    Object.assign(this, category);
    makeAutoObservable(this);
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
  const categories = queryData?.data.map(category => new Category(category));
  const categoryPage = new CategoryPage(categories || []);

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
