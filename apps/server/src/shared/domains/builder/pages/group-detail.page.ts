import { PageBuilder, TableBuilder } from '@shared/types';

export const getGroupDetailPage = (): PageBuilder => {
  return {
    name: '그룹',
    type: 'Page',
    query: {
      name: 'useGetGroup',
      hasResourceId: true,
      hasParams: true,
    },
    form: {
      state: {
        payload: {
          name: '',
        },
      },
      sections: [
        {
          name: '그룹 정보',
          components: [
            {
              path: 'name',
              type: 'Input',
              props: {
                fullWidth: true,
                label: '그룹명',
                readOnly: true,
                labelPlacement: 'outside',
                isRequired: true,
              },
            },
            {
              type: 'TableBuilder',
              props: {
                tableBuilder: {
                  buttons: [
                    {
                      name: '멤버 추가',
                    },
                  ],
                  selectionMode: 'multiple',
                  query: {
                    name: 'useGetUsersByQuery',
                  },
                  columns: [
                    {
                      id: 'name',
                      accessorKey: 'name',
                      header: {
                        name: '이름',
                      },
                    },
                  ],
                } as TableBuilder,
              },
            },
          ],
        },
      ],
    },
  };
};
