import { PageBuilder } from '@shared/types';
import { categoryForm } from '../forms/category.form';

export const categoryNewEditPage: PageBuilder = {
  type: 'Form',
  name: '카테고리 편집',
  form: categoryForm,
};
