import { RouteBuilder } from '@shared/types';

export const timelineSessionsRoute: RouteBuilder = {
  name: '세션',
  pathname: 'sessions',
  page: {
    type: 'Page',
    state: {
      dataGrid: {
        selectedRowIds: [],
      },
    },
    name: '세션',
    dataGrid: {
      buttons: [],
      table: {
        selectionMode: 'multiple',
        query: {
          name: 'useGetSessionsByQuery',
          params: {
            timelineId: null,
          },
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
              name: '시작일',
            },
            cell: {
              type: 'dateTime',
            },
          },
          {
            accessorKey: 'endDateTime',
            header: {
              name: '종료일',
            },
            cell: {
              type: 'dateTime',
            },
          },
        ],
      },
    },
  },
};
