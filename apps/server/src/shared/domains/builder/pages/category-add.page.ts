import { PageBuilder } from '@shared/types';

export const categoryAddPage: PageBuilder = {
  type: 'Form',
  name: '카테고리 추가',
  form: {
    name: '카테고리 정보',
    button: {
      name: '수정',
      mutation: 'createCategory',
      failure: {
        message: '카테고리 수정에 실패했습니다.',
        link: '..',
      },
      success: {
        message: '카테고리 수정이 완료되었습니다.',
        link: '..',
      },
    },
    sections: [
      {
        name: '카테고리 정보',
        components: [
          {
            type: 'Input',
            path: 'name',
            props: {
              value: '',
              fullWidth: true,
              label: '카테고리 이름',
            },
          },
        ],
      },
    ],
  },
};
