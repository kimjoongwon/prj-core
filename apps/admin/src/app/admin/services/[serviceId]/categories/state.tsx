import { CategoryDto, CreateCategoryDto } from '@shared/frontend';
import { observable } from 'mobx';

const defaultCategoryForm = {
  name: '',
  ancestorIds: [],
  parentId: null,
  serviceId: '',
  spaceId: '',
};

interface CategoryPage {
  categories: CategoryDto[];
  openedCategory: CategoryDto;
  form: CreateCategoryDto;
}

export const state: CategoryPage = observable({
  categories: [],
  openedCategory: {} as CategoryDto,
  form: defaultCategoryForm,
});
