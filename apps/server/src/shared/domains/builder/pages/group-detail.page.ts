import { PageBuilder } from '@shared/types';

export const getGroupDetailPage = (): PageBuilder => {
  return {
    name: '그룹',
    type: 'Page',
    query: {
      name: 'useGetGroup',
      hasResourceId: true,
      hasParams: true,
    },
    form: {
      state: {
        payload: {
          name: '',
        },
      },
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
              },
            },
          ],
        },
      ],
    },
  };
};
