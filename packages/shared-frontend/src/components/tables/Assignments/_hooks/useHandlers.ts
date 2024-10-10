import { useParams } from 'next/navigation';
import { AssignmentsTableProps } from '..';
import { galaxy } from '../../../../providers';
import { useMutations } from './useMutations';

export const useHandlers = (context: {
  mutations: ReturnType<typeof useMutations>;
  props: AssignmentsTableProps;
}) => {
  const {
    props,
    mutations: { deleteAssignment },
  } = context;

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

  const onClickDelete = () => {
    deleteAssignment({
      assignmentId: props?.state?.selectedKeys?.[0],
    });
  };

  return {
    onClickCreate,
    onClickDelete,
  };
};
