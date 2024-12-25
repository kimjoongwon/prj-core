import { PageBuilder } from '@shared/types';

export const categoryNewEditPage: PageBuilder = {
  type: 'Page',
  name: '카테고리 새편집',
  form: {
    name: '정보',
    state: {
      payload: {
        name: '',
        type: 'LEAF',
        parentId: null,
      },
    },
    button: {
      name: '저장',
      mutation: {
        name: 'createCategory',
        hasParentId: true,
        hasPayload: true,
        hasServiceId: true,
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
            path: 'body.name',
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
