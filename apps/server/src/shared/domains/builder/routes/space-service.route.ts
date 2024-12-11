import { RouteBuilder } from '@shared/types';

export const spaceServiceRoute: RouteBuilder = {
  pathname: '/admin/main/services/space-service',
  name: '공간 서비스',
  active: false,
  layout: {
    page: {
      name: '공간 서비스',
    },
  },
};
