import { Injectable } from '@nestjs/common';
import { PageBuilder } from '@shared/types';

@Injectable()
export class GroupsPage {
  getMeta() {
    const page: PageBuilder = {
      type: 'Page',
      name: '목록',
      dataGrid: {
        table: {
          query: {
            name: 'useGetGroupsByQuery',
            params: {
              serviceId: '',
              skip: 0,
              take: 2,
            },
            mapper: {
              serviceId: 'serviceId',
            },
          },
          columns: [
            {
              accessorKey: 'name',
              header: {
                name: '이름',
                expandable: true,
              },
              cell: {
                expandable: true,
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
                    color: 'primary',
                    name: '수정',
                    navigator: {
                      pathname: 'groups/:groupId/edit',
                    },
                  },
                  {
                    color: 'secondary',
                    name: '상세',
                    navigator: {
                      pathname: 'groups/:groupId',
                    },
                  },
                  {
                    color: 'danger',
                    name: '삭제',
                    mutation: {
                      name: 'deleteGroup',
                    },
                    alert: {
                      message: '!!!',
                    },
                  },
                ],
              },
            },
          ],
        },
        buttons: [
          {
            name: '생성',
            navigator: {
              pathname: 'groups/new/edit',
            },
          },
        ],
      },
    };

    return page;
  }
}
