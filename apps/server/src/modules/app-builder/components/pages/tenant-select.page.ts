import { Injectable } from '@nestjs/common';
import { IButtonBuilder, ListboxBuilderProps, PageBuilder, SectionBuilder } from '@shared/types';

@Injectable()
export class TenantSelectPage {
  constructor() {}

  async build(): Promise<PageBuilder> {
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
                  path: 'selectTenantDto.selectedTenantId',
                  query: {
                    apiKey: 'useGetTenantsByQuery',
                    valueField: 'id',
                    labelField: 'space.ground.name',
                  },
                  selectionMode: 'single',
                } as ListboxBuilderProps,
              },
              {
                name: 'ButtonBuilder',
                props: {
                  mutation: { name: 'selectTenant', path: 'selectTenantDto' },
                  color: 'primary',
                  size: 'md',
                  children: '선택',
                  validation: {
                    required: { value: true, message: '그라운드를 선택해주세요.' },
                  },
                  navigator: {
                    type: 'href',
                    route: {
                      name: '대시보드',
                      fullPath: '/admin/dashboard',
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
        selectedTenantDto: {
          selectedTenantId: '',
        },
      },
      sections,
    };
  }
}
