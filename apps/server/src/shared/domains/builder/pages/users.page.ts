import { PageBuilder } from '@shared/types';
import { getUserTable } from '../tables/users.table';

export const usersPage: PageBuilder = {
  name: '이용자',
  type: 'Page',
  table: getUserTable(),
};
