import { PageBuilder } from '@shared/types';

export const categoriesPage: PageBuilder = {
  type: 'Page',
  query: {
    name: 'useGetCategoriesByQuery',
    hasParams: true,
    hasServiceId: true,
    params: {
      serviceId: '',
      type: 'ROOT',
    },
  },
  form: {
    name: '카테고리',
    sections: [
      {
        name: '카테고리',
        components: [
          {
            gridProps: {
              size: 12,
            },
            type: 'DataGrid',
            props: {
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
                  accessorKey: 'id',
                  header: {
                    name: 'ID',
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
                        name: '수정',
                        navigator: {
                          pathname: ':resourceId/edit',
                          hasResourceId: true,
                          params: {
                            resourceId: '',
                          },
                        },
                      },
                      {
                        name: '추가',
                        navigator: {
                          pathname: ':parentId/add',
                          hasParentId: true,
                          params: {
                            parentId: '',
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    ],
  },
};
