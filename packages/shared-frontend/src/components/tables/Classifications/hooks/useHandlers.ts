import { useParams } from 'next/navigation';
import { ClassificationsTableProps } from '..';
import { galaxy } from '../../../../providers';
import { useMutations } from './useMutations';

export const useHandlers = (context: {
  mutations: ReturnType<typeof useMutations>;
  props: ClassificationsTableProps;
}) => {
  const {
    props,
    mutations: { deleteClassification },
  } = context;

  // const { serviceId } = useParams<{ serviceId: string }>();

  const onClickCreate = () => {
    //   params: {
    //     classificationId: 'new',
    //     serviceId,
    //   },
    // });
  };

  const onClickDelete = () => {
    deleteClassification({
      classificationId: props?.state?.selectedKeys?.[0],
    });
  };

  return {
    onClickCreate,
    onClickDelete,
  };
};
