import { Injectable } from '@nestjs/common';
import { $Enums } from '@prisma/client';
import { ContextProvider } from '@shared';
import { IButtonBuilder, InputProps, PageBuilder, ResourceBuilder } from '@shared/types';

@Injectable()
export class CategoryPage {
  build(type: $Enums.CategoryTypes): PageBuilder {
    console.log('CategoryPage build called');
    // 기존 데이터 로드
    let formInputs = {
      name: '',
      type,
      parentId: null,
      tenantId: ContextProvider.getTenantId(),
    };

    return {
      state: {
        form: {
          inputs: formInputs,
        },
      },
      sections: [
        {
          stacks: [
            {
              type: 'VStack',
              elements: [
                {
                  name: 'ResourceBuilder',
                  props: {
                    resourceName: 'category',
                    query: {
                      name: 'useGetCategoryById',
                    },
                    sections: [
                      {
                        stacks: [
                          {
                            type: 'VStack',
                            elements: [
                              {
                                name: 'Text',
                                props: {
                                  children: '카테고리',
                                  className: 'text-2xl font-bold mb-4',
                                },
                              },
                              {
                                name: 'Input',
                                props: {
                                  label: '이름',
                                  path: 'form.inputs.name',
                                } as InputProps<any>,
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  } satisfies ResourceBuilder,
                },
              ],
            },
          ],
        },
      ],
    };
  }
}
