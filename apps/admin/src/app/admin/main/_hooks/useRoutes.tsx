import { Route } from '@shared/frontend';
import { CiCalendar, CiGrid41, CiBoxList, CiSettings } from 'react-icons/ci';

export const useRoutes = () => {
  let routes: Route[] = [
    {
      name: '이용자',
      pathname: '/admin/main/users',
      icon: <CiGrid41 />,
    },
    {
      name: '지점',
      pathname: '/admin/main/gym/spaces',
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
