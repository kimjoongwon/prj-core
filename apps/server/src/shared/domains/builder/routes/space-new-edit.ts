import { RouteBuilder } from '@shared/types';
import { Injectable } from '@nestjs/common';
import { CategoryLogic } from '../../../logic/category.logic';

@Injectable()
export class SpaceNewEditRoute {
  constructor(private readonly categoryLogic: CategoryLogic) {}

  async getRoute(): Promise<RouteBuilder> {
    const options = await this.categoryLogic.getLastLeafCategoryOptionsBy('SPACE');
    return {
      name: '그룹새편집',
      pathname: 'new/edit',
      page: {
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
              mapper: {
                serviceId: 'serviceId',
                categoryId: 'categoryId',
                name: 'name',
              },
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
                      path: 'name',
                      props: {
                        label: '그룹 이름',
                        placeholder: '그룹 이름을 입력해주세요.',
                      },
                    },
                    {
                      type: 'Select',
                      path: 'categoryId',
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
      },
    };
  }
}
