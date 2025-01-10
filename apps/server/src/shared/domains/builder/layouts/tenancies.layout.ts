import { LayoutBuilder } from '@shared/types';

export const getTenanciesLayout = (): LayoutBuilder => {
  return {
    type: 'Modal',
    page: {
      type: 'Page',
      name: '공간',
      dataGrid: {
        table: {
          query: {
            name: 'useGetSpacesByQuery',
          },
          columns: [
            {
              accessorKey: 'name',
              header: {
                name: '이름',
              },
            },
            {
              id: 'actions',
              header: {
                name: 'Actions',
              },
              cell: {
                buttons: [
                  {
                    name: '선택',
                    navigator: {
                      pathname: '/admin/spaces/:spaceId/services',
                      mapper: {
                        id: 'spaceId',
                      },
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
};
