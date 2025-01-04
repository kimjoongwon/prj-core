import { PageBuilder } from '@shared/types';
import { getUserTable } from '../tables/users.table';

export const getGroupUsersPage = (): PageBuilder => {
  return {
    name: '이용자',
    type: 'Page',
    dataGrid: {
      table: getUserTable(),
    },
  };
};
