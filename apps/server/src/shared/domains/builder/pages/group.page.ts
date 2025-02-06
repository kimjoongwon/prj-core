import { Injectable } from '@nestjs/common';
import { PageBuilder, TabBuilder } from '@shared/types';

@Injectable()
export class GroupPage {
  getMeta() {
    const page: PageBuilder = {
      name: '그룹',
      type: 'Page',
      query: {
        name: 'useGetGroup',
        idMapper: 'groupId',
      },
      state: {},
      form: {
        sections: [
          {
            name: '기본 정보',
            stacks: [
              {
                type: 'VStack',
                inputs: [
                  {
                    path: 'form.inputs.name',
                    type: 'Input',
                    props: {
                      fullWidth: true,
                      label: '그룹명',
                      readOnly: true,
                      labelPlacement: 'outside',
                      isRequired: true,
                    },
                  },
                ],
              },
            ],
          },
          {
            name: '관련 정보',
            stacks: [
              {
                type: 'VStack',
                inputs: [
                  {
                    type: 'TabNavigation',
                    props: {
                      tabBuilder: {
                        options: [
                          {
                            key: 'members',
                            text: '멤버',
                            value: 'associations',
                          },
                          {
                            key: 'users',
                            text: '사용자',
                            value: 'users',
                          },
                        ],
                      } as TabBuilder,
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    };

    return page;
  }
}
