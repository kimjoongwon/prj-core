import { PageBuilder } from '@shared/types';
import { getCategoryForm } from '../forms/category.form';
import { CreateCategoryDto } from '../../../entities/categories/dtos/create-category.dto';

export const categoryNewEditPage: PageBuilder = {
  type: 'Form',
  name: '카테고리 편집',
  form: getCategoryForm({
    name: 'createCategory',
    body: new CreateCategoryDto(),
    resourceId: 'categoryId',
  }),
};
