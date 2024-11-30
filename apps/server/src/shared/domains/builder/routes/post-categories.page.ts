// import { PageState } from '@shared/types';

// const services = [
//   {
//     name: '유저 서비스',
//     pathname: '/user-service',
//   },
//   {
//     name: '공간 서비스',
//     pathname: '/space-service',
//   },
//   {
//     name: '창고 서비스',
//     pathname: '/depot-service',
//   },
//   {
//     name: '게시물 서비스',
//     pathname: '/post-service',
//   },
// ];
// export const getCategoryPage = (pathname: string) => {
//   const name = services.find((service) => service.pathname === '/' + pathname)?.name + '카테고리';

//   return {
//     name,
//     route: {
//       pathname: `/admin/main/services/${pathname}/categories`,
//       name,
//     },
//     payload: undefined,
//   } as PageState;
// };
