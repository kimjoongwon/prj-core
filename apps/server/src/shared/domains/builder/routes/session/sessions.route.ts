import { RouteBuilder } from '@shared/types';
import { SessionQueryDto } from '../../../../dtos';
import { Order } from '../../../../constants';

export const sessionsRoute: RouteBuilder = {
  name: '세션',
  pathname: 'sessions',
  page: {
    name: '세션',
    dataGrid: {
      buttons: [
        {
          name: '추가',
          navigator: {
            pathname: 'new/edit',
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
                  },
                  color: 'danger',
                },
              ],
            },
          },
        ],
      },
    },
  },
};
