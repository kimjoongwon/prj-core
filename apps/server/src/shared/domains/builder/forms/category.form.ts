import { FormBuilder, Mutation } from '@shared/types';

export const getCategoryForm = (mutation: Mutation): FormBuilder => ({
  name: '정보',
  state: {
    body: {
      name: '',
      type: 'LEAF',
      parentId: null,
    },
  },
  button: {
    name: '저장',
    mutation,
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
});
