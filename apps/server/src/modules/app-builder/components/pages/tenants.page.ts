import { Injectable } from '@nestjs/common';
import { QueryDto, QueryWorkspaceDto, WorkspacesService } from '@shared';
import { ButtonBuilder, ListboxProps, PageBuilder, SectionBuilder } from '@shared/types';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class TenantsPage {
  constructor(readonly workspaceService: WorkspacesService) {}

  async build(): Promise<PageBuilder> {
    const { items } = await this.workspaceService.getManyByQuery(
      plainToInstance(QueryWorkspaceDto, {}),
    );
    const workspaceOptions = items.map((workspace) => ({
      text: workspace.name,
      value: workspace.id,
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
                  title: '워크스페이스 선택',
                  options: workspaceOptions,
                  selectionMode: 'single',
                  path: 'form.inputs.selectedWorkspace',
                } as ListboxProps<any>,
              },
              {
                name: 'ButtonBuilder',
                props: {
                  apiKey: 'selectWorkspace',
                  color: 'primary',
                  size: 'md',
                  children: '선택',
                  path: 'form.inputs.selectedWorkspace',
                  validation: {
                    required: { value: true, message: '테넌트를 추가해주세요.' },
                  },
                } as ButtonBuilder,
              },
            ],
          },
        ],
      },
    ];

    const form = {
      id: 'tenants',
      type: 'list',
      resourceName: 'Tenants',
      resourceLabel: '테넌트',
      sections,
    };

    return {
      name: '테넌트',
      state: {
        selectedWorkspace: '',
      },
      form,
    };
  }
}
