import { PageBuilder } from '@shared/types';

export const categoriesPage: PageBuilder = {
  type: 'Table',
  table: {
    apiKey: 'useGetCategoriesByQuery',
    query: {
      type: 'ROOT',
    },
    columns: [
      {
        accessorKey: 'name',
        meta: {
          headerName: '이름',
          expandable: true,
        },
      },
      {
        accessorKey: 'id',
        meta: {
          headerName: 'ID',
        },
      },
      {
        id: 'action',
        header: '액션',
        meta: {
          headerName: '액션 버튼',
          buttons: [
            {
              type: 'button',
              name: '수정',
              link: ':id/edit',
              paramKeys: ['id'],
            },
            {
              type: 'button',
              name: '추가',
              link: ':id/add',
              paramKeys: ['id'],
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
        paramKeys: [],
      },
      success: {
        message: '카테고리 추가가 완료되었습니다.',
        link: '/admin/main/services/user-service/categories',
        paramKeys: [],
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
