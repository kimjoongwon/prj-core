import { RouteBuilder } from '@shared/types';

export class CategoryRoute {
  getRoute(): RouteBuilder {
    return {
      name: '카테고리',
      pathname: ':categoryId',
      layout: {
        name: '카테고리',
        type: 'Modal',
        page: {
          query: {
            name: 'useGetCategoryById',
            idMapper: 'categoryId',
          },
          state: {
            form: {
              data: {
                name: '',
              },
            },
          },
          name: '카테고리',
          form: {
            sections: [
              {
                name: '기본정보',
                components: [
                  {
                    type: 'Input',
                    path: 'name',
                    props: {
                      label: '카테고리 이름',
                      placeholder: '카테고리 이름을 입력해주세요.',
                      readOnly: true,
                    },
                  },
                ],
              },
            ],
          },
        },
      },
    };
  }
}
