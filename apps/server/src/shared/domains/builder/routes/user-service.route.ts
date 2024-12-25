import { LayoutBuilder, RouteBuilder } from '@shared/types';

export const userServiceRoute: RouteBuilder = {
  name: '유저 서비스',
  pathname: '/admin/main/services/user-service',
};

export const userServiceLayout: LayoutBuilder = {
  page: {
    name: '유저 서비스',
  },
};
