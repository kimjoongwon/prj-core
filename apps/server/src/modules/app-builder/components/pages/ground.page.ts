import { Injectable } from '@nestjs/common';
import { IButtonBuilder, PageBuilder, ResourceBuilder } from '@shared/types';
import { PageType } from '../types/page.types';

@Injectable()
export class GroundPage {
  build(type: PageType): PageBuilder {
    // type에 따른 기본 데이터 설정
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

    // type에 따른 페이지 제목 설정
    const getPageTitle = (type: PageType): string => {
      switch (type) {
        case 'create':
          return '그라운드 생성';
        case 'modify':
          return '그라운드 수정';
        case 'detail':
          return '그라운드 상세';
        default:
          return '그라운드';
      }
    };

    // type에 따른 mutation 설정
    const getMutationConfig = (type: PageType) => {
      switch (type) {
        case 'create':
          return {
            name: 'createGround',
            path: 'form.inputs',
            queryKey: 'getGetGroundsByQueryQueryKey',
          };
        case 'modify':
          return {
            name: 'updateGroundById',
            path: 'form.inputs',
            queryKey: 'getGetGroundsByQueryQueryKey',
          };
        default:
          return undefined;
      }
    };

    // type에 따른 query 설정
    const getQueryConfig = (type: PageType) => {
      if (type === 'detail' || type === 'modify') {
        return {
          name: 'useGetGroundById',
        };
      }
      return undefined;
    };

    // type에 따른 버튼 텍스트 설정
    const getButtonText = (type: PageType): string => {
      switch (type) {
        case 'create':
          return '생성';
        case 'modify':
          return '수정';
        default:
          return '저장';
      }
    };

    // type에 따른 입력 필드 readonly 설정
    const isReadonly = type === 'detail';

    const mutationConfig = getMutationConfig(type);
    const queryConfig = getQueryConfig(type);

    // elements 배열 구성
    const baseElements = [
      {
        name: 'Text' as const,
        props: {
          children: getPageTitle(type),
          className: 'text-2xl font-bold mb-4',
        },
      },
      {
        name: 'Input' as const,
        props: {
          label: '이름',
          path: 'form.inputs.name',
          isReadOnly: isReadonly,
        },
      },
      {
        name: 'Input' as const,
        props: {
          label: '주소',
          path: 'form.inputs.address',
          isReadOnly: isReadonly,
        },
      },
      {
        name: 'Input' as const,
        props: {
          label: '전화번호',
          path: 'form.inputs.phone',
          isReadOnly: isReadonly,
        },
      },
      {
        name: 'Input' as const,
        props: {
          label: '이메일',
          path: 'form.inputs.email',
          isReadOnly: isReadonly,
        },
      },
    ];

    // detail 모드가 아닐 때만 버튼 추가
    const elements =
      type !== 'detail'
        ? [
            ...baseElements,
            {
              name: 'ButtonBuilder' as const,
              props: {
                children: getButtonText(type),
                mutation: mutationConfig,
                navigator: {
                  type: 'back',
                },
              } satisfies IButtonBuilder,
            },
          ]
        : baseElements;

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
                    query: queryConfig,
                    sections: [
                      {
                        stacks: [
                          {
                            type: 'VStack',
                            elements,
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
