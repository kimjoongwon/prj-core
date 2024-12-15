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
        navigate: {
          pathname: '..',
        },
      },
      success: {
        message: '카테고리 수정이 완료되었습니다.',
        navigate: {
          pathname: '..',
        },
      },
    },
    sections: [
      {
        name: '카테고리 정보',
        payload: {
          data: {
            parentId: '',
            name: '',
            serviceId: '',
          },
        },
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
