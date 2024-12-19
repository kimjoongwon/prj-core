import { PageBuilder } from '@shared/types';
import { categoryForm } from '../forms/category.form';

export const categoryAddPage: PageBuilder = {
  type: 'Form',
  name: '카테고리 추가',
  form: categoryForm,
};
