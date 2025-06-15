import { Injectable } from '@nestjs/common';
import { IButtonBuilder, PageBuilder, ResourceBuilder } from '@shared/types';

@Injectable()
export class GroupPage {
  build(): PageBuilder {
    console.log('GroupPage build called');
    // 기존 데이터 로드
    let formInputs = {
      name: '',
      label: '',
      tenantId: '',
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
                    resourceName: 'group',
                    query: {
                      name: 'useGetGroupById',
                    },
                    sections: [
                      {
                        stacks: [
                          {
                            type: 'VStack',
                            elements: [
                              {
                                name: 'Input',
                                props: {
                                  label: '이름',
                                  path: 'form.inputs.name',
                                },
                              },
                              {
                                name: 'Input',
                                props: {
                                  label: '라벨',
                                  path: 'form.inputs.label',
                                },
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
