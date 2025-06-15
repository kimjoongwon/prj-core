import { Injectable } from '@nestjs/common';
import { IButtonBuilder, PageBuilder, ResourceBuilder, SpacerProps } from '@shared/types';
import path from 'path';

@Injectable()
export class GroundPage {
  build(): PageBuilder {
    console.log('GroundPage build called');
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
                    resourceName: 'ground',
                    query: {
                      name: 'useGetGroundById',
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
                                  children: '그라운드',
                                  className: 'text-2xl font-bold mb-4',
                                },
                              },
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
                              {
                                name: 'Input',
                                props: {
                                  label: '전화번호',
                                  path: 'form.inputs.phone',
                                },
                              },
                              {
                                name: 'Input',
                                props: {
                                  label: '이메일',
                                  path: 'form.inputs.email',
                                },
                              },
                              {
                                name: 'ButtonBuilder',
                                props: {
                                  children: '저장',
                                  mutation: {
                                    name: 'updateGroundById',
                                    path: 'form.inputs',
                                  },
                                  navigator: {
                                    type: 'back',
                                  },
                                } satisfies IButtonBuilder,
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
