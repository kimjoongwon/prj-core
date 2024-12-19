import { PageBuilder } from '@shared/types';
import { getCategoryForm } from '../forms/category.form';

export const categoryAddPage: PageBuilder = {
  type: 'Form',
  name: '카테고리 추가',
  form: getCategoryForm({
    key: 'createCategory',
    keyForConvertParamsToPayloads: ['parentId'],
  }),
};
