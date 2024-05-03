import { useParams } from 'next/navigation';
import { useQueries } from './useQueries';
import { router } from '@shared/frontend';

export const useHandlers = (props: {
  queries: ReturnType<typeof useQueries>;
}) => {
  const {
    queries: { updateCategory },
  } = props;

  const { categoryId, serviceId } = useParams<{
    categoryId: string;
    serviceId: string;
  }>();

  const onClickEdit = () => {
    router.push({
      url: '/admin/services/:serviceId/categories/:categoryId/edit',
      params: {
        categoryId,
        serviceId,
      },
    });
  };

  const onClickDelete = () => {
    updateCategory({
      categoryId,
      data: {
        deletedAt: new Date().toString(),
      },
    });
  };

  return {
    onClickEdit,
    onClickDelete,
  };
};
