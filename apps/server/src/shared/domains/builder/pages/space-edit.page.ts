import { PageBuilder } from '@shared/types';
import { Injectable } from '@nestjs/common';
import { CategoriesService } from '../../../services/categories.service';

@Injectable()
export class SpaceEditPage {
  constructor(private readonly categoriesService: CategoriesService) {}

  async getRoute(): Promise<PageBuilder> {
    const options = await this.categoriesService.getLastLeafCategoryOptionsBy('SPACE');
    return {
      name: '새편집',
      state: {
        form: {
          data: {},
        },
      },
      form: {
        button: {
          name: '저장',
          mutation: {
            name: 'createSpace',
            payloadPath: 'form',
          },
          navigator: {
            pathname: '..',
          },
        },
        sections: [
          {
            name: '기본정보',
            stacks: [
              {
                type: 'VStack',
                inputs: [
                  {
                    type: 'Input',
                    path: 'form.inputs.name',
                    props: {
                      label: '그룹 이름',
                      placeholder: '그룹 이름을 입력해주세요.',
                    },
                  },
                  {
                    type: 'Select',
                    path: 'form.inputs.categoryId',
                    props: {
                      label: '카테고리',
                      options,
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    };
  }
}
