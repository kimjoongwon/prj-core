import { PageBuilder } from '@shared/types';
import { plainToInstance } from 'class-transformer';
import { CategoryDto, CreateCategoryDto } from '../../../entities';
import { name } from 'mustache';

export const categoryEditPage: PageBuilder = {
  type: 'Form',
  name: '카테고리 편집',
  params: {
    serviceId: '',
  },
  query: {
    name: 'useGetCategoryById',
    resourceId: 'categoryId',
  },
  form: {
    name: '정보',
    state: {
      body: {
        name,
      },
    },
    button: {
      name: '저장',
      mutation: {
        name: 'updateCategory',
        resourceId: 'categoryId',
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
