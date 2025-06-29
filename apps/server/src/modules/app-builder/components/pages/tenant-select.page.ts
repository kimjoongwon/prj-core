import { IButtonBuilder, ListboxBuilderProps, PageBuilder, SectionBuilder } from '@shared/types';

export const getTenantSelectPage = (): PageBuilder => {
    const sections: SectionBuilder[] = [
      {
        stacks: [
          {
            type: 'VStack' as const,
            elements: [
              {
                name: 'ListboxBuilder',
                props: {
                  title: '그라운드 선택',
                  path: 'selectedTenantId',
                  query: {
                    type: 'list',
                    query: {
                      name: 'useGetTenantsByQuery',
                    },
                    listOptions: {
                      valueField: 'id',
                      labelField: 'space.ground.name',
                    },
                  },
                  selectionMode: 'single',
                } as ListboxBuilderProps,
              },
              {
                name: 'ButtonBuilder',
                props: {
                  mutation: {
                    name: 'selectTenant',
                    data: {
                      selectedTenantId: 'selectedTenantId',
                    },
                    // 새로운 validationFields 방식 (권장)
                    validationFields: {
                      selectedTenantId: {
                        required: { value: true, message: '그라운드를 선택해주세요.' },
                      },
                    },
                    // 기존 방식 (하위 호환성을 위해 유지, 하지만 validationFields가 우선)
                    // validationPath: 'selectedTenantId'
                  },
                  color: 'primary',
                  size: 'md',
                  children: '선택',
                  // validation 속성은 validationFields로 대체됨
                  // validation: {
                  //   required: { value: true, message: '그라운드를 선택해주세요.' },
                  // },
                  navigator: {
                    type: 'href',
                    route: {
                      name: '대시보드',
                      fullPath: '/admin/dashboard/user-service/users',
                    },
                  },
                } as IButtonBuilder,
              },
            ],
          },
        ],
      },
    ];

    return {
      name: '테넌트',
      state: {
        form: {
          inputs: {
            selectedTenantId: '',
          },
        },
      },
      sections,
    };
};
