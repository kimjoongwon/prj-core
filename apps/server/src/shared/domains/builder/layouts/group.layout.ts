import { LayoutBuilder } from '@shared/types';
import { getGroupPage } from '../pages/group.page';

export const groupLayout: LayoutBuilder = {
  type: 'Modal',
  page: getGroupPage(),
};
