import { CategoryDto, CreateCategoryDto } from '@shared/frontend';
import { observable } from 'mobx';

interface State {
  openedCategory: CategoryDto;
  form: CreateCategoryDto;
}
export const createCategoryDto: CreateCategoryDto = {
  name: '',
  ancestorIds: [],
  parentId: null,
  serviceId: '',
  spaceId: '',
};

export const state: State = observable({
  openedCategory: {} as CategoryDto,
  form: { ...createCategoryDto },
});

export const categoriesPage = {
  state,
};
