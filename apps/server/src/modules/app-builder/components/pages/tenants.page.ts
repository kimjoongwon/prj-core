import { Injectable } from '@nestjs/common';
import { PageBuilder, SectionBuilder } from '@shared/types';

@Injectable()
export class TenantsPage {
  build(): PageBuilder {
    // 섹션 구성
    const sections: SectionBuilder[] = [
      {
        stacks: [
          {
            type: 'VStack' as const,
            elements: [
              {
                name: 'Text',
                props: {
                  children: '테넌트 관리',
                  size: 'xl',
                  weight: 'bold',
                },
              },
              {
                name: 'Spacer',
                props: {
                  size: '4',
                },
              },
              {
                name: 'Text',
                props: {
                  children: '테넌트 목록을 관리할 수 있습니다.',
                  color: 'secondary',
                },
              },
              {
                name: 'WorkspaceSelect',
                props: {
                  color: 'secondary',
                },
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
      state: {},
      form,
    };
  }
}
