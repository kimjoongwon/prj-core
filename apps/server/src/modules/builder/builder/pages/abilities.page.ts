import { Injectable } from '@nestjs/common';

@Injectable()
export class AbilitiesPage {
  getRoute() {
    return {
      name: '목록',
      dataGrid: {
        buttons: [
          {
            color: 'primary',
            name: '추가',
            navigator: {
              pathname: 'new/edit',
            },
          },
        ],
        table: {
          query: {
            name: 'useGetAbilitiesByQuery',
          },
          columns: [
            {
              accessorKey: 'id',
              header: {
                name: 'Identifier',
              },
            },
          ],
        },
      },
    };
  }
}
