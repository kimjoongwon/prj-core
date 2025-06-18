import { Injectable } from '@nestjs/common';
import { $Enums } from '@prisma/client';
import { ContextProvider } from '@shared';
import {
  IButtonBuilder,
  InputProps,
  PageBuilder,
  PageTypes,
  ResourceBuilder,
  SpacerProps,
  TextProps,
} from '@shared/types';

@Injectable()
export class GroupPage {
  build(pageType: PageTypes, type: $Enums.GroupTypes): PageBuilder {
    // 기존 데이터 로드
    let formInputs = {
      name: '',
      label: '',
      type,
      tenantId: ContextProvider.getTenantId(),
    };

    // pageType에 따른 페이지 제목 설정
    const getPageTitle = () => {
      switch (pageType) {
        case 'create':
        case 'add':
          return '그룹 생성';
        case 'modify':
          return '그룹 수정';
        case 'detail':
          return '그룹 상세';
        default:
          return '그룹';
      }
    };

    // pageType에 따른 버튼 구성
    const getActionButtons = () => {
      const buttons = [];

      if (pageType === 'create' || pageType === 'add') {
        buttons.push({
          name: 'ButtonBuilder',
          props: {
            color: 'primary',
            children: '생성',
            mutation: {
              name: 'createGroup',
              queryKey: '/api/v1/groups',
              path: 'form.inputs',
            },
            navigator: {
              type: 'back',
            },
          } satisfies IButtonBuilder,
        });
      }

      if (pageType === 'modify') {
        buttons.push({
          name: 'ButtonBuilder',
          props: {
            color: 'primary',
            children: '수정',
            mutation: {
              name: 'updateGroupById',
              queryKey: '/api/v1/groups',
              path: 'form.inputs',
            },
            navigator: {
              type: 'back',
            },
          } satisfies IButtonBuilder,
        });
      }

      return buttons;
    };

    // pageType에 따른 Input 비활성화 설정
    const isReadOnly = pageType === 'detail';

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
                                name: 'Text',
                                props: {
                                  children: getPageTitle(),
                                  className: 'text-2xl font-bold mb-4',
                                  variant: 'title',
                                } satisfies TextProps,
                              },
                              {
                                name: 'Input',
                                props: {
                                  label: '이름',
                                  path: 'form.inputs.name',
                                  isReadOnly,
                                } as InputProps<any>,
                              },
                              {
                                name: 'Input',
                                props: {
                                  label: '라벨',
                                  path: 'form.inputs.label',
                                  isReadOnly,
                                } as InputProps<any>,
                              },
                              {
                                name: 'Spacer',
                                props: {
                                  size: 4,
                                } satisfies SpacerProps,
                              },
                              ...getActionButtons(),
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
