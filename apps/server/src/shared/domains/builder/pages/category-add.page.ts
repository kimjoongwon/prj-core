import { PageBuilder } from '@shared/types';

export const categoryAddPage: PageBuilder = {
  type: 'Page',
  name: '카테고리 추가',
  form: {
    name: '정보',
    state: {
      payload: {
        name: '',
        type: 'LEAF',
        parentId: null,
        serviceId: '',
      },
    },
    button: {
      name: '저장',
      mutation: {
        name: 'createCategory',
        hasPayload: true,
        hasParentId: true,
        hasServiceId: true,
      },
      alert: {
        message: '카테고리가 추가되었습니다.',
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
