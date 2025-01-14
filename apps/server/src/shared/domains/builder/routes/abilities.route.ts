import { Injectable } from '@nestjs/common';
import { RouteBuilder } from '@shared/types';

@Injectable()
export class AbilitiesRoute {
  getRoute(): RouteBuilder {
    return {
      name: '능력',
      pathname: 'abilities',
      layout: {
        type: 'DataGrid',
        page: {
          dataGrid: {
            buttons: [
              {
                color: 'primary',
                name: '추가',
                navigator: {
                  pathname: 'add',
                },
              },
            ],
            table: {
              query: {
                name: 'useGetAbilitiesByQuery',
                params: {},
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
        },
      },
    };
  }
}
