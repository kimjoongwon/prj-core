import { USER_EDIT_PAGE_PATH } from '@constants';
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
      url: USER_EDIT_PAGE_PATH,
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
