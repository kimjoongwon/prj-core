import { PageBuilder } from '@shared/types';

export const categoryNewEditPage: PageBuilder = {
  type: 'Page',
  name: '새편집',
  state: {
    form: {
      data: {
        name: '',
        type: 'ROOT',
        parentId: null,
      },
    },
  },
  form: {
    name: '정보',
    button: {
      name: '저장',
      mutation: {
        name: 'createCategory',
        mapper: {
          serviceId: 'serviceId',
        },
      },
      alert: {
        message: '!!!',
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
