import { CategoryDto, useGetCategories } from '@shared/frontend';
import { computed, makeAutoObservable } from 'mobx';
import { entries, findIndex, groupBy } from 'lodash-es';
import React from 'react';

export class CategoryPage {
  openedParentIds: string[] = [];
  categories: Category[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  get categoriesGroupedByParentId() {
    return groupBy(this.categories, 'parentId');
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
    const categoriesGroupedByParentId =
      this.state.categoryPage?.categoriesGroupedByParentId!;

    const parentIds = Object.keys(categoriesGroupedByParentId);

    const depth = findIndex(parentIds, parentId => parentId === this.parentId);

    const categories = categoriesGroupedByParentId?.[this.parentId || ''];

    categories?.forEach(category => {
      console.log(category.id);

      if (category.id === this.id) {
        this.state.categoryPage?.openedParentIds.push(this.id);
        category.state.open = true;
      } else {
        category.state.open = false;
      }
    });
  }
}

interface CategoryPageContextValue {
  categoryPage: CategoryPage | null;
}

export const CategoryPageContext =
  React.createContext<CategoryPageContextValue>({} as CategoryPageContextValue);

export const useCategoriesPage = () => {
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
        categoryPage,
      }}
    >
      {props.children}
    </CategoryPageContext.Provider>
  );
};
