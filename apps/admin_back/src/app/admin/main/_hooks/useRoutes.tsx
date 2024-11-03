import { Route } from '@shared/frontend';
import { CiCalendar, CiGrid41, CiBoxList, CiSettings } from 'react-icons/ci';

export const useRoutes = () => {
  let routes: Route[] = [
    {
      name: '이용자',
      pathname: '/admin/main/user-service',
      icon: <CiGrid41 />,
    },
    {
      name: '공간',
      pathname: '/admin/main/space-service',
      icon: <CiGrid41 />,
    },
    {
      name: '게시물',
      pathname: '/admin/main/post-service',
      icon: <CiBoxList />,
    },
    {
      name: '저장소',
      pathname: '/admin/main/file-service',
      icon: <CiSettings />,
    },
  ];

  return {
    routes,
  };
};
