import { LayoutBuilder } from '@shared/types';
import { categoriesPage } from '../pages/categories.page';

export const categoriesLayout: LayoutBuilder = {
  type: 'DataGrid',
  page: categoriesPage,
};
