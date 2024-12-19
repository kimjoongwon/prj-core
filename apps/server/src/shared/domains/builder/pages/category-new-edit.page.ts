import { PageBuilder } from '@shared/types';
import { getCategoryForm } from '../forms/category.form';

export const categoryNewEditPage: PageBuilder = {
  type: 'Form',
  name: '카테고리 편집',
  form: getCategoryForm('updateCategory'),
};
