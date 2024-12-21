import { FormBuilder, Mutation } from '@shared/types';

export const getCategoryForm = (mutation: Mutation): FormBuilder => ({
  name: '정보',
  button: {
    name: '저장',
    mutation,
    failure: {
      message: '카테고리 추가에 실패했습니다.',
      link: '..',
    },
    success: {
      message: '카테고리 추가가 완료되었습니다.',
      link: '..',
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
            value: '',
          },
          type: 'Input',
        },
      ],
    },
  ],
});
