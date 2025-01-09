import { RouteBuilder } from '@shared/types';
import { categoriesLayout } from '../layouts/categories.layout';

export const categoriesRoute: RouteBuilder = {
  name: '카테고리',
  pathname: 'categories',
  layout: categoriesLayout,
  children: [],
};
