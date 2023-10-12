import { useCoCRouter } from '@hooks';
import { useParams } from 'next/navigation';

export const useHandlers = () => {
  const router = useCoCRouter();
  const { userId = '' } = useParams();
  const onClickList = () => {
    router.back();
  };
  const onClickEdit = () => {
    router.replace({
      url: '/admin/dashboard/users/:userId/edit',
      params: {
        userId,
      },
    });
  };

  return {
    onClickEdit,
    onClickList,
  };
};
