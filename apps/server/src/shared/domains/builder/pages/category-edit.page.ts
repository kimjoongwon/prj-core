import { PageBuilder } from '@shared/types';
import { getCategoryForm } from '../forms/category.form';
import { CreateCategoryDto } from '../../../entities';

export const categoryEditPage: PageBuilder = {
  type: 'Form',
  name: '카테고리 편집',
  params: {
    categoryId: '',
  },
  query: {
    name: 'useGetCategoryById',
    resourceId: 'categoryId',
    params: {
      isDeleted: false,
    },
  },
  form: getCategoryForm({
    name: 'updateCategory',
    body: new CreateCategoryDto(),
  }),
};
