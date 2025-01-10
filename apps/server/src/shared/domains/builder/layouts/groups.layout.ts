import { LayoutBuilder } from '@shared/types';
import { groupsPage } from '../pages/groups.page';

export const groupsLayout: LayoutBuilder = {
  type: 'DataGrid',
  page: groupsPage,
};
