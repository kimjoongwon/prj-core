import { PageBuilder } from '@shared/types';
import { Injectable } from '@nestjs/common';
import { $Enums } from '@prisma/client';
import { CategoriesService } from '../../../services';

@Injectable()
export class RoleEditPage {
  constructor(private readonly categoriesService: CategoriesService) {}

  async getMeta(): Promise<PageBuilder> {
    const options = await this.categoriesService.getLastLeafCategoryOptionsBy('ROLE');
    const roleOptions = Object.keys($Enums.Roles).map((role) => ({
      key: role,
      text: role,
      value: role,
    }));

    return {
      name: '새편집',
      state: {},
      form: {
        button: {
          name: '저장',
          mutation: {
            name: 'createRole',
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
                    type: 'Select',
                    path: 'form.name',
                    props: {
                      label: '역할 이름',
                      options: roleOptions,
                      placeholder: '역할 이름을 입력해주세요.',
                    },
                  },
                  {
                    type: 'Select',
                    path: 'form.categoryId',
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
