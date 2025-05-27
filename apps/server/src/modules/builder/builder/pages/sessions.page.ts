import { SessionQueryDto } from '../../../../shared/dto';
import { Order } from '../../../../shared/constant';

export class SessionsPage {
  getMeta() {
    const page = {
      name: '세션',
      dataGrid: {
        buttons: [
          {
            name: '추가',
            navigator: {
              pathname: 'sessions/new/edit',
            },
          },
        ],
        table: {
          query: {
            params: {
              startDateTimeSortOrder: Order.ASC,
            } as SessionQueryDto,
            name: 'useGetSessionsByQuery',
          },
          columns: [
            {
              accessorKey: 'name',
              header: {
                name: '이름',
              },
            },
            {
              accessorKey: 'type',
              header: {
                name: '유형',
              },
            },
            {
              accessorKey: 'startDateTime',
              header: {
                name: '시작일시',
              },
              cell: {
                type: 'dateTime',
              },
            },
            {
              accessorKey: 'endDateTime',
              header: {
                name: '종료일시',
              },
              cell: {
                type: 'dateTime',
              },
            },
            {
              id: 'actions',
              header: {
                name: '액션',
              },
              cell: {
                buttons: [
                  {
                    name: '삭제',
                    mutation: {
                      name: 'deleteSession',
                      idMapper: 'id',
                      invalidationKey: 'sessions',
                    },
                    color: 'danger',
                  },
                ],
              },
            },
          ],
        },
      },
    };

    return page;
  }
}
