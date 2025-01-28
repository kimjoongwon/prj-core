import { Injectable } from '@nestjs/common';
import { RouteBuilder } from '@shared/types';

@Injectable()
export class AbilitiesRoute {
  getRoute(): RouteBuilder {
    return {
      name: '능력',
      pathname: 'abilities',
      page: {
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
      },
    };
  }
}
