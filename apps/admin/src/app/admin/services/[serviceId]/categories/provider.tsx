import {
  CategoryDto,
  CreateCategoryDto,
  useGetCategories,
} from '@shared/frontend';
import { makeAutoObservable } from 'mobx';
import { groupBy } from 'lodash-es';
import React from 'react';

export class CategoryPage {
  openedCategory: Category = {} as Category;
  categories: Category[] = [];
  form: CreateCategoryDto = {
    name: '',
    ancestorIds: [],
    parentId: null,
    serviceId: '',
    spaceId: '',
  };

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
    categoryPage: CategoryPage;
    open: boolean;
  } = {
    categoryPage: {} as CategoryPage,
    open: false,
  };
  id: string = '';
  ancestorIds: string[] = ['null'];
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

    const categories = categoriesGroupedByParentId?.[this.parentId!];

    categories?.forEach(category => {
      if (category.id === this.id) {
        this.state.categoryPage.openedCategory = this;
        category.state.open = true;
      } else {
        category.state.open = false;
      }
    });
  }
}

type CategoryPageContextValue = CategoryPage;

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

  const categories = queryData?.data.map(category => {
    return new Category(category, categoryPage);
  });

  categoryPage.setCategories(categories || []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <CategoryPageContext.Provider value={categoryPage}>
      {props.children}
    </CategoryPageContext.Provider>
  );
};
