import { Injectable } from '@nestjs/common';
import { ContextProvider, QueryTenantDto, TenantsService } from '@shared';
import { IButtonBuilder, ListboxProps, PageBuilder, SectionBuilder } from '@shared/types';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class TenantSelectPage {
  constructor(readonly tenantService: TenantsService) {}

  async build(): Promise<PageBuilder> {
    const userId = ContextProvider.getAuthUserId();
    const query = plainToInstance(QueryTenantDto, {
      userId,
    });
    const { tenants } = await this.tenantService.getManyByQuery(query);
    const tenantOptions = tenants.map((tenant) => ({
      text: tenant.space?.ground?.name,
      value: tenant?.id,
    }));

    const sections: SectionBuilder[] = [
      {
        stacks: [
          {
            type: 'VStack' as const,
            elements: [
              {
                name: 'Listbox',
                props: {
                  title: '그라운드 선택',
                  options: tenantOptions,
                  selectionMode: 'single',
                  path: 'selectTenantDto.selectedTenantId',
                } as ListboxProps<any>,
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
