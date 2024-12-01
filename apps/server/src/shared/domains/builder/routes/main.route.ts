import { RouteBuilder } from '@shared/types';

export const mainRoute: RouteBuilder = {
  name: '메인',
  pathname: '/admin/main',
  active: true,
  layout: {
    page: {
      name: '메인',
    },
  },
};
