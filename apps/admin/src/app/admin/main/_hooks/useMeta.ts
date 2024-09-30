import { Paths, useGetAllServiceSuspense } from '@shared/frontend';

export const useMeta = () => {
  const getAllService = useGetAllServiceSuspense();
  const services = getAllService.data?.data;
  const sessionServiceId = services?.find(
    service => service.label === '세션',
  )?.id;
  const sessionParams = { serviceId: sessionServiceId };

  const reservationServiceId = services?.find(
    service => service.label === '예약',
  )?.id;

  const reservationParams = { serviceId: reservationServiceId };

  const userServiceId = services?.find(
    service => service.label === '이용자',
  )?.id;

  const userParams = { serviceId: userServiceId };

  const spaceServiceId = services?.find(
    service => service.label === '공간',
  )?.id;

  const spaceParams = { serviceId: spaceServiceId };

  let navItems: {
    name: string;
    pathname: Paths;
    params?: object;
    children?: { name: string; pathname: Paths; params?: object }[];
  }[] = [
    {
      name: '세션',
      pathname: '/admin/main/services/:serviceId',
      params: sessionParams,
      children: [
        {
          name: '세션 목록',
          pathname: '/admin/main/services/:serviceId/sessions',
          params: sessionParams,
        },
      ],
    },
    {
      name: '예약',
      pathname: '/admin/main/services/:serviceId',
      params: reservationParams,
      children: [
        {
          name: '예약 관리',
          pathname: '/admin/main/services/:serviceId/reservations',
          params: reservationParams,
        },
      ],
    },
    {
      name: '공간',
      pathname: '/admin/main/services/:serviceId',
      params: spaceParams,
      children: [
        {
          name: '공간 목록',
          pathname: '/admin/main/services/:serviceId/spaces',
          params: spaceParams,
        },
        {
          name: '그룹',
          pathname: '/admin/main/services/:serviceId/groups',
          params: spaceParams,
        },
        {
          name: '카테고리',
          pathname: '/admin/main/services/:serviceId/categories',
          params: spaceParams,
        },
      ],
    },
    {
      name: '이용자',
      pathname: '/admin/main/services/:serviceId',
      params: userParams,
      children: [
        {
          name: '목록',
          pathname: '/admin/main/services/:serviceId',
          params: userParams,
        },
        {
          name: '그룹',
          pathname: '/admin/main/services/:serviceId/groups',
          params: userParams,
        },
        {
          name: '카테고리',
          pathname: '/admin/main/services/:serviceId/categories',
          params: userParams,
        },
      ],
    },
  ];

  return {
    navItems,
  };
};
