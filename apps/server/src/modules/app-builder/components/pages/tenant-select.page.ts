import { IButtonBuilder, ListboxBuilderProps, PageBuilder } from '@shared/types';

export const getTenantSelectPage = (): PageBuilder => {
  return {
    name: '그라운드 선택',
    state: {
      selectedTenantId: '',
    },
    elements: [
      {
        name: 'VStack',
        props: {
          className: 'space-y-6 max-w-md mx-auto mt-16',
        },
        children: [
          {
            name: 'Logo',
          },
          {
            name: 'Text',
            props: {
              children: '그라운드 선택',
              variant: 'h1',
              className: 'text-center text-2xl font-bold mb-6',
            },
          },
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
                validationFields: {
                  selectedTenantId: {
                    required: { value: true, message: '그라운드를 선택해주세요.' },
                  },
                },
              },
              color: 'primary',
              size: 'md',
              children: '선택',
              className: 'w-full',
              navigator: {
                type: 'push',
                route: {
                  fullPath: '/admin/dashboard',
                },
              },
            } satisfies IButtonBuilder,
          },
        ],
      },
    ],
  };
};
