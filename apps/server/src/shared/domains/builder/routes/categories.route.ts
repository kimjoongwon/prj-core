import { RouteBuilder } from '@shared/frontend';

const services = [
  {
    name: '유저 서비스',
    pathname: '/user-service',
  },
  {
    name: '공간 서비스',
    pathname: '/space-service',
  },
  {
    name: '창고 서비스',
    pathname: '/depot-service',
  },
  {
    name: '게시물 서비스',
    pathname: '/post-service',
  },
];
export const getCategoriesRoute = (pathname: string) => {
  const name = services.find((service) => service.pathname === '/' + pathname)?.name + '카테고리';

  return {
    pathname: `/admin/main/services/${pathname}/categories`,
    name,
    active: false,
    layout: {
      page: {
        name,
      },
    },
  } as RouteBuilder;
};
