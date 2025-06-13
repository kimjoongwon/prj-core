import { Injectable } from '@nestjs/common';
import { InputBuilderProps, PageBuilder, ResourceBuilder, SectionBuilder } from '@shared/types';
import { ContextProvider } from '../../../../shared/provider/context.provider';
import { GroundsRepository } from '../../../../shared/repository';

@Injectable()
export class GroundPage {
  constructor(private readonly groundsRepository: GroundsRepository) {}

  build(): PageBuilder {
    // 기존 데이터 로드
    let formInputs = {
      name: '',
      label: '',
      phone: '',
      email: '',
      address: '',
      businessNo: '',
      logoImageFileId: '',
      imageFileId: '',
      spaceId: '',
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
                    resourceName: 'Ground',
                    query: {
                      name: 'useGetGroundById',
                      params: {},
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
                                  label: '주소',
                                  path: 'form.inputs.address',
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
