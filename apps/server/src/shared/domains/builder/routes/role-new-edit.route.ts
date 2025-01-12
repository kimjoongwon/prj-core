import { RouteBuilder } from '@shared/types';
import { InputProps } from '@nextui-org/react';
import { Injectable } from '@nestjs/common';
import { CategoryLogic } from '../../../logic/category.logic';

@Injectable()
export class RoleNewEditRoute {
  constructor(private readonly categoryLogic: CategoryLogic) {}

  async getRoute(): Promise<RouteBuilder> {
    const options = await this.categoryLogic.getLastLeafCategoryOptionsBy('ROLE');

    return {
      name: '그룹새편집',
      pathname: 'new/edit',
      layout: {
        name: '새편집',
        type: 'Modal',
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
                name: 'createRole',
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
                components: [
                  {
                    type: 'Input',
                    path: 'name',
                    props: {
                      label: '역할 이름',
                      placeholder: '역할 이름을 입력해주세요.',
                    } as InputProps,
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
        },
      },
    };
  }
}
