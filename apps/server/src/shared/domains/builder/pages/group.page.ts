import { PageBuilder, TabBuilder, TableBuilder } from '@shared/types';

export const getGroupPage = (): PageBuilder => {
  return {
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
          name: '그룹 정보',
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
  };
};
