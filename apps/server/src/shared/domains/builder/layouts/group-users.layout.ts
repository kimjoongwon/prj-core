import { LayoutBuilder } from '@shared/types';
import { getGroupUsersPage } from '../pages/group-users.page';

export const groupUsersLayout: LayoutBuilder = {
  page: getGroupUsersPage(),
};
