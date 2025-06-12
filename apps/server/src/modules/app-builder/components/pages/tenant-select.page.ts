import { Injectable } from '@nestjs/common';
import { QueryTenantDto, TenantsService } from '@shared';
import { ButtonBuilder, ListboxProps, PageBuilder, SectionBuilder } from '@shared/types';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class TenantSelectPage {
  constructor(readonly tenantService: TenantsService) {}

  async build(): Promise<PageBuilder> {
    const { items } = await this.tenantService.getManyByQuery(plainToInstance(QueryTenantDto, {}));
    const tenantOptions = items.map((tenant) => ({
      text: tenant.space.ground.name,
      value: tenant.id,
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
                  path: 'params.selectedTenantId',
                } as ListboxProps<any>,
              },
              {
                name: 'ButtonBuilder',
                props: {
                  mutation: { name: 'selectTenant', path: 'params' },
                  color: 'primary',
                  size: 'md',
                  children: '선택',
                  validation: {
                    required: { value: true, message: '그라운드를 선택해주세요.' },
                  },
                  navigator: {
                    route: {
                      name: '대시보드',
                    },
                  },
                } as ButtonBuilder,
              },
            ],
          },
        ],
      },
    ];

    return {
      name: '테넌트',
      state: {
        selectedTenantId: '',
      },
      sections,
    };
  }
}
