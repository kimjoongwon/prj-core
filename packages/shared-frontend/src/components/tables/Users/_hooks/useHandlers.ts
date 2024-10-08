import { useParams } from 'next/navigation';
import { UsersTableProps } from '..';
import { galaxy } from '../../../../providers';

export const useHandlers = (context: { props: UsersTableProps }) => {
  const { serviceId } = useParams<{ serviceId: string }>();

  const onClickCreate = () => {
    galaxy.router.push({
      url: '/admin/main/app/services/:serviceId/groups/:groupId/edit',
      params: {
        groupId: 'new',
        serviceId,
      },
    });
  };

  return {
    onClickCreate,
  };
};
