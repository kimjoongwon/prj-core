import { RouteBuilder } from '@shared/types';
import { InputProps } from '@nextui-org/react';
import { Injectable } from '@nestjs/common';
import { CategoryLogic } from '../../../logic/category.logic';
import { $Enums } from '@prisma/client';

@Injectable()
export class RoleNewEditRoute {
  constructor(private readonly categoryLogic: CategoryLogic) {}

  async getRoute(): Promise<RouteBuilder> {
    const options = await this.categoryLogic.getLastLeafCategoryOptionsBy('ROLE');
    const roleOptions = Object.keys($Enums.Roles).map((role) => ({
      key: role,
      text: role,
      value: role,
    }));

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
                    type: 'Select',
                    path: 'name',
                    props: {
                      label: '역할 이름',
                      options: roleOptions,
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
