import { Route } from '@shared/frontend';
import { CiCalendar, CiGrid41, CiBoxList, CiSettings } from 'react-icons/ci';

export const useRoutes = () => {
  let routes: Route[] = [
    {
      name: '내 예약',
      pathname: '/admin/main/reservations',
      icon: <CiCalendar />,
    },
    {
      name: '지점',
      pathname: '/admin/main/spaces',
      icon: <CiGrid41 />,
    },
    {
      name: '예약',
      pathname: '/admin/main/reservation',
      icon: <CiBoxList />,
    },
    {
      name: '앱',
      pathname: '/admin/main/app',
      icon: <CiSettings />,
    },
  ];

  return {
    routes,
  };
};
