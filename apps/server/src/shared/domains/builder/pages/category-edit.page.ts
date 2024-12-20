import { PageBuilder } from '@shared/types';
import { getCategoryForm } from '../forms/category.form';

export const categoryEditPage: PageBuilder = {
  type: 'Form',
  name: '카테고리 편집',
  query: {
    name: 'useGetCategoryById',
    keysForConvertPathParamsToPayload: [
      {
        getKey: 'categoryId',
        setKey: 'categoryId',
      },
    ],
    defaultParams: {},
    params: {
      categoryId: '',
    },
  },
  form: getCategoryForm({ key: 'updateCategory' }),
};
