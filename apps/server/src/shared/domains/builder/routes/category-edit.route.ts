import { RouteBuilder } from '@shared/types';
import { categoryEditLayout } from '../layouts/category-edit.layout';

export const categoryEditRoute: RouteBuilder = {
  name: '수정',
  pathname: ':categoryId/edit',
  layout: categoryEditLayout,
};
