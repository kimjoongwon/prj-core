import { PageBuilder } from '@shared/types';
import { Injectable } from '@nestjs/common';
@Injectable()
export class CategoryAddPage {
  getMeta() {
    const page: PageBuilder = {
      type: 'Page',
      name: '추가',
      state: {
        form: {
          data: {
            name: '',
            type: 'LEAF',
            parentId: null,
            serviceId: '',
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
              parentId: 'parentId',
            },
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
            stacks: [
              {
                type: 'VStack',
                inputs: [
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
        ],
      },
    };

    return page;
  }
}
