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
        cell: 'test',
        meta: {
          headerName: '액션 버튼',
          edit: {
            type: 'button',
            button: {
              children: '수정',
              color: 'primary',
              flow: {
                try: {
                  pathname: 'edit',
                },
              },
            },
          },
        },
      },
    ],
  },
  form: {
    name: '카테고리',
    button: {
      children: '검색',
      fullWidth: true,
      color: 'primary',
      flow: {
        mutation: 'getToken',
        try: {
          message: '카테고리를 생성중입니다...',
          severity: 'success',
          pathname: '/admin/main/services/user-service/categories',
        },
        catch: {
          message: '카테고리 생성에 실패했습니다.',
          severity: 'error',
          pathname: '/admin/main/services/user-service/categories',
        },
        finally: {
          message: '카테고리 생성에 성공했습니다.',
          pathname: '/admin/main/services/user-service/categories',
        },
      },
    },
    sections: [
      {
        name: '카테고리',
        payload: {
          data: {
            name: '',
          },
        },
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
