import { PageBuilder } from '@shared/types';

export const categoryAddPage: PageBuilder = {
  type: 'Form',
  name: '카테고리 편집',
  form: {
    name: '정보',
    button: {
      name: '저장',
      mutation: 'Category',
      failure: {
        message: '카테고리 수정에 실패했습니다.',
        link: '..',
      },
      success: {
        message: '카테고리 수정이 완료되었습니다.',
        link: '..',
      },
    },
    defaultValues: {
      type: 'LEAF',
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
  },
};
