import { Injectable } from '@nestjs/common';
import { RouteBuilder } from '@shared/types';

@Injectable()
export class SpacesRoute {
  async getRoute(): Promise<RouteBuilder> {
    return {
      name: '목록',
      pathname: 'spaces',
      page: {
        name: '목록',
        dataGrid: {
          buttons: [
            {
              name: '생성',
              navigator: {
                pathname: 'new/edit',
              },
            },
          ],
          table: {
            query: {
              name: 'useGetSpacesByQuery',
              params: {},
            },
            columns: [
              {
                accessorKey: 'name',
                header: {
                  name: '이름',
                },
              },
              {
                id: 'action',
                header: {
                  name: '액션',
                },
                cell: {
                  buttons: [
                    {
                      color: 'danger',
                      name: '삭제',
                      mutation: {
                        name: 'deleteSpace',
                        idMapper: 'id',
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      },
    };
  }
}
