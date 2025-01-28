import { Injectable } from '@nestjs/common';
import { TabBuilder } from '@shared/types';

@Injectable()
export class GroupRoute {
  getMeta() {
    const route = {
      name: '그룹 상세',
      pathname: ':groupId',
      page: {
        name: '그룹',
        type: 'Page',
        query: {
          name: 'useGetGroup',
          idMapper: 'groupId',
        },
        state: {
          form: {
            data: {
              name: '',
            },
          },
        },
        form: {
          sections: [
            {
              name: '기본 정보',
              components: [
                {
                  path: 'name',
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
            {
              name: '관련 정보',
              components: [
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
      },
    };

    return route;
  }
}
