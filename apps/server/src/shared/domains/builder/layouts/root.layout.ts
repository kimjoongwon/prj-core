import { LayoutBuilder } from '@shared/types';

export const rootLayout: LayoutBuilder = {
  page: {
    name: 'ROOT',
    type: 'Page',
    form: {
      sections: [
        {
          name: '컴포넌트 리스트',
          components: [
            {
              type: 'FileUpload',
              path: 'name',
              props: {
                label: '그룹 이름',
              },
            },
          ],
        },
      ],
    },
  },
};
