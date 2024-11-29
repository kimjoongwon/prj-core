import { PageState } from '@shared/types';

export const mainPage: PageState = {
  name: '로그인',
  pathname: '/admin/main',
  layout: {
    bottom: {
      component: {
        type: 'BottomTab',
      },
    },
  },
  payload: {},
  forms: [
    {
      name: '로그인',
      components: [],
    },
  ],
};
