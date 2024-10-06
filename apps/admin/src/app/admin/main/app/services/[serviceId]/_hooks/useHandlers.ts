import { galaxy, Tab } from '@shared/frontend';
import { useParams } from 'next/navigation';

export const useHandlers = () => {
  const { serviceId } = useParams<{ serviceId: string }>();

  const onClicKCategories = () => {
    galaxy.router.push({
      url: '/admin/main/app/services/:serviceId/categories',
      params: { serviceId },
    });
  };

  const onClickGroups = () => {
    galaxy.router.push({
      url: '/admin/main/app/services/:serviceId/groups',
      params: { serviceId },
    });
  };

  return {
    onClicKCategories,
    onClickGroups,
  };
};
