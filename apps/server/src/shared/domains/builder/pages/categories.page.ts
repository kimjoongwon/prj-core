import { PageBuilder } from '@shared/types';

export const categoriesPage: PageBuilder = {
  type: 'Table',
  query: {
    name: 'useGetCategoriesByQuery',
    params: {
      serviceId: '',
      type: 'ROOT',
    },
  },
  table: {
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
              success: {
                link: ':categoryId/edit',
                keysForConvertPayloadsToParams: ['categoryId'],
              },
            },
            {
              name: '추가',
              success: {
                link: ':parentId/add',
                keysForConvertPayloadsToParams: ['parentId'],
              },
            },
          ],
        },
      },
      ,
    ],
  },
  form: {
    name: '카테고리',
    button: {
      name: '추가',
      failure: {
        message: '카테고리 추가에 실패했습니다.',
        link: '/admin/main/services/user-service/categories',
      },
      success: {
        message: '카테고리 추가가 완료되었습니다.',
        link: '/admin/main/services/user-service/categories',
      },
    },
    sections: [
      {
        name: '카테고리',
        gridProps: {
          xs: 12,
        },
        components: [
          {
            type: 'Input',
            gridProps: {
              xs: 12,
            },
            path: 'name',
            props: {
              fullWidth: true,
              value: '',
              label: '카테고리 이름',
              placeholder: '카테고리 이름을 입력해주세요.',
            } as any,
          },
        ],
      },
    ],
  },
};
