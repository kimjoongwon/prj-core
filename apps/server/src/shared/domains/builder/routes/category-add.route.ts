import { RouteBuilder } from '@shared/types';
import { categoryAddLayout } from '../layouts/category-add.layout';

export const categoryAddRoute: RouteBuilder = {
  name: '추가',
  pathname: ':parentId/add',
  layout: categoryAddLayout,
};
