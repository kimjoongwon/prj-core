import { RouteBuilder } from '@shared/types';

export const authRoute: RouteBuilder = {
  name: '인증',
  pathname: 'auth',
  layout: {
    page: {
      type: 'Outlet',
    },
  },
};
