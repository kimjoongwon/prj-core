import { PageBuilder } from '@shared/types';

export class RolesPage {
  getMeta() {
    const page: PageBuilder = {
      name: '목록',
      dataGrid: {
        buttons: [
          {
            name: '생성',
            color: 'primary',
            navigator: {
              pathname: 'new/edit',
            },
          },
        ],
        table: {
          query: {
            name: `useGetRolesByQuery`,
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
