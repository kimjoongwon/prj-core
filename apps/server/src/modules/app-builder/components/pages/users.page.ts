import { PageBuilder } from '@shared/types';
export class UsersPage {
  getMeta() {
    const page: PageBuilder = {
      name: '목록',
      dataGrid: {
        table: {
          query: {
            name: `useGetUsersByQuery`,
          },
          columns: [
            {
              accessorKey: 'name',
              header: {
                name: '이름',
              },
            },
          ],
        },
      },
    };
    return page;
  }
}
