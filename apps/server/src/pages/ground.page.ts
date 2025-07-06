import type {
  ApiQueryBuilder,
  IButtonBuilder,
  InputProps,
  Mutation,
  PageBuilder,
  PageTypes,
  ResourceBuilder,
  TabNavigationProps,
} from '@shared/types';
import { FormProps } from '@heroui/react';

export const getGroundPage = (type: PageTypes): PageBuilder => {
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
  const getPageTitle = (type: PageTypes): string => {
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
  const getMutationConfig = (type: PageTypes): Mutation => {
    switch (type) {
      case 'create':
        return {
          name: 'createGround',
          queryKey: '/api/v1/grounds',
          validationFields: {
            'form.inputs.name': {
              required: { value: true, message: '그라운드 이름은 필수입니다' },
            },
            'form.inputs.label': {
              required: { value: true, message: '라벨은 필수입니다' },
            },
            'form.inputs.email': {
              patterns: [
                {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: '올바른 이메일 형식이 아닙니다',
                },
              ],
            },
          },
        };
      case 'modify':
        return {
          name: 'updateGroundById',
          queryKey: '/api/v1/grounds',
          validationFields: {
            'form.inputs.name': {
              required: { value: true, message: '그라운드 이름은 필수입니다' },
            },
            'form.inputs.label': {
              required: { value: true, message: '라벨은 필수입니다' },
            },
            'form.inputs.email': {
              patterns: [
                {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: '올바른 이메일 형식이 아닙니다',
                },
              ],
            },
          },
          pathParams: {
            groundId: 'params.groundId', // pageState.groundId에서 ID를 가져옴
          },
        };
      default:
        return undefined;
    }
  };

  // type에 따른 query 설정
  const getQueryConfig = (type: PageTypes): ApiQueryBuilder => {
    if (type === 'detail' || type === 'modify') {
      return {
        type: 'resource' as const,
        query: {
          name: 'useGetGroundById',
          pathParams: {
            groundId: 'params.groundId',
          },
        },
        resourceName: 'ground',
      };
    }
    return undefined;
  };

  // type에 따른 버튼 텍스트 설정
  const getButtonText = (type: PageTypes): string => {
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
  const queryConfig: ApiQueryBuilder = getQueryConfig(type);

  // elements 배열 구성
  const baseElements = [
    {
      name: 'Input' as const,
      props: {
        label: '이름',
        path: 'form.inputs.name',
        isReadOnly: isReadonly,
        variant: 'underlined',
      } as InputProps<any>,
    },
    {
      name: 'Input' as const,
      props: {
        label: '라벨',
        path: 'form.inputs.label',
        isReadOnly: isReadonly,
        variant: 'underlined',
      } as InputProps<any>,
    },
    {
      name: 'Input' as const,
      props: {
        label: '전화번호',
        path: 'form.inputs.phone',
        isReadOnly: isReadonly,
        variant: 'underlined',
      } as InputProps<any>,
    },
    {
      name: 'Input' as const,
      props: {
        label: '이메일',
        path: 'form.inputs.email',
        isReadOnly: isReadonly,
        variant: 'underlined',
      } as InputProps<any>,
    },
    {
      name: 'Input' as const,
      props: {
        label: '주소',
        path: 'form.inputs.address',
        isReadOnly: isReadonly,
        variant: 'underlined',
      } as InputProps<any>,
    },
    {
      name: 'Input' as const,
      props: {
        label: '사업자번호',
        path: 'form.inputs.businessNo',
        isReadOnly: isReadonly,
        variant: 'underlined',
      } as InputProps<any>,
    },
  ];

  // detail 모드가 아닐 때만 버튼 추가
  const elements = type !== 'detail' ? [...baseElements] : baseElements;

  return {
    name: getPageTitle(type),
    state: {
      form: {
        inputs: formInputs,
      },
    },
    elements: [
      {
        name: 'ResourceBuilder',
        props: {
          resourceName: 'ground',
          ...(queryConfig || {
            type: 'resource' as const,
            query: { name: 'useGetGroundById' },
            resourceName: 'ground',
          }),
          elements: [
            {
              name: 'VStack',
              props: {
                className: 'space-y-4'
              },
              children: [
                {
                  name: 'Form',
                  props: {
                    className: 'space-y-4',
                  } as FormProps,
                  children: [
                    {
                      name: 'VStack',
                      props: {
                        className: 'space-y-4',
                      },
                      children: elements,
                    },
                    {
                      name: 'HStack',
                      children: [
                        {
                          name: 'FileUploader' as const,
                          props: {
                            label: '로고 이미지 파일 ID',
                            path: 'form.inputs.logoImageFileId',
                            isReadOnly: isReadonly,
                            variant: 'underlined',
                          } as InputProps<any>,
                        },
                        {
                          name: 'FileUploader' as const,
                          props: {
                            label: '이미지 파일 ID',
                            path: 'form.inputs.imageFileId',
                            isReadOnly: isReadonly,
                            variant: 'underlined',
                          } as InputProps<any>,
                        },
                      ],
                    },
                    ...(type !== 'detail' ? [{
                      name: 'ButtonBuilder' as const,
                      props: {
                        children: getButtonText(type),
                        mutation: mutationConfig,
                        navigator: {
                          type: 'back',
                        },
                        style: {
                          position: 'sticky',
                        },
                      } satisfies IButtonBuilder,
                    }] : []),
                  ],
                },
              ],
            },
          ],
        } satisfies ResourceBuilder,
      },
    ],
  };
};
