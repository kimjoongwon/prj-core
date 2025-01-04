import { PageBuilder } from '@shared/types';
import { getUserTable } from '../tables/users.table';

export const getGroupUsersPage = (): PageBuilder => {
  return {
    name: '이용자',
    type: 'Page',
    dataGrid: {
      table: getUserTable({
        selectionMode: 'single',
        columns: [
          {
            id: 'actions',
            header: {
              name: '액션',
            },
            cell: {
              buttons: [
                {
                  name: '추가',
                  color: 'primary',
                  mutation: {
                    name: 'createAssignment',
                    hasPayload: true,
                    hasServiceId: true,
                  },
                },
              ],
            },
          },
        ],
      }),
    },
  };
};
