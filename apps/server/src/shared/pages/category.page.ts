import { ContextProvider } from '@shared';
import { $Enums } from '@shared/schema';
import {
  IButtonBuilder,
  InputProps,
  PageBuilder,
  PageTypes,
  ResourceBuilder,
  SpacerProps,
  TextProps,
} from '@shared/types';

export const getCategoryPage = (pageType: PageTypes, type: $Enums.CategoryTypes): PageBuilder => {
  const formInputs = {
    name: '',
    type,
    parentId: null,
  };

  // pageType에 따른 페이지 제목 설정
  const getPageTitle = () => {
    switch (pageType) {
      case 'create':
      case 'add':
        return '카테고리 생성';
      case 'modify':
        return '카테고리 수정';
      case 'detail':
        return '카테고리 상세';
      default:
        return '카테고리';
    }
  };

  // pageType에 따른 버튼 구성
  const getActionButtons = () => {
    const buttons: any[] = [];

    if (pageType === 'create' || pageType === 'add') {
      buttons.push({
        name: 'ButtonBuilder',
        props: {
          color: 'primary',
          children: pageType === 'create' ? '생성' : '추가',
          mutation: {
            name: 'createCategory',
            queryKey: '/api/v1/categories',
            validationFields: {
              'form.inputs.name': {
                required: { value: true, message: '카테고리 이름은 필수입니다' },
              },
            },
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
            name: 'updateCategoryById',
            queryKey: '/api/v1/categories',
            validationFields: {
              'form.inputs.name': {
                required: { value: true, message: '카테고리 이름은 필수입니다' },
              },
            },
            pathParams: {
              categoryId: 'categoryId', // pageState.categoryId에서 ID를 가져옴
            },
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
    elements: [
      {
        name: 'ResourceBuilder',
        props: {
          resourceName: 'category',
          type: 'resource' as const,
          query: {
            name: 'useGetCategoryById',
          },
          elements: [
            {
              name: 'VStack',
              props: {
                className: 'space-y-4',
              },
              children: [
                {
                  name: 'Text',
                  props: {
                    children: getPageTitle(),
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
                  name: 'Spacer',
                  props: {
                    size: 4,
                  } satisfies SpacerProps,
                },
                ...getActionButtons(),
              ],
            },
          ],
        } satisfies ResourceBuilder,
      },
    ],
  };
};
