import { PageBuilder } from '@shared/types';

export const categoryEditPage: PageBuilder = {
  type: 'Page',
  name: '편집',
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
  form: {
    name: '정보',
    button: {
      name: '저장',
      mutation: {
        name: 'updateCategory',
        idMapper: 'categoryId',
      },
      alert: {
        message: '카테고리가 수정되었습니다.',
      },
      navigator: {
        pathname: '..',
      },
    },
    sections: [
      {
        name: '카테고리 정보',
        components: [
          {
            path: 'name',
            props: {
              fullWidth: true,
              label: '카테고리 이름',
              placeholder: '카테고리 이름을 입력해주세요.',
            },
            type: 'Input',
          },
        ],
      },
    ],
  },
};
