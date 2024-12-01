import { RouteBuilder } from '@shared/types';

export const userServiceRoute: RouteBuilder = {
  name: '유저 서비스',
  pathname: '/admin/main/services/user-service',
  active: false,
  layout: {
    page: {
      name: '유저 서비스',
    },
  },
};
