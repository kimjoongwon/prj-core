import { PageBuilder } from '@shared/types';

export const categoryEditPage: PageBuilder = {
  type: 'Form',
  name: '카테고리 편집',
  params: {
    categoryId: '',
  },
  api: {
    query: {
      name: 'useGetCategoryById',
      resourceId: 'categoryId',
      params: {
        isDeleted: false,
      },
    },
  },
  // form: getCategoryForm({ key: 'updateCategory' }),
};
