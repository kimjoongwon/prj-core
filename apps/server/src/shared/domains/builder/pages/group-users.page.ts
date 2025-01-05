import { PageBuilder } from '@shared/types';
import { getUserTable } from '../tables/users.table';

export const getGroupUsersPage = (): PageBuilder => {
  const groupUsersPage: PageBuilder = {
    name: '이용자',
    type: 'Page',
    state: {
      form: {
        data: {
          serviceId: '',
        },
      },
    },
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
                    mapper: {
                      resourceId: 'groupId',
                      rowId: 'userId',
                      serviceId: 'serviceId',
                    },
                    name: 'createUserAssignment',
                    hasPayload: true,
                    hasRowId: true,
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

  return groupUsersPage;
};
