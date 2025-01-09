import { RouteBuilder } from '@shared/types';
import { categoryNewEditLayout } from '../layouts/category-new-edit.layout';

export const categoryNewEdit: RouteBuilder = {
  name: '카테고리 새편집',
  pathname: 'new/edit',
  layout: categoryNewEditLayout,
};
