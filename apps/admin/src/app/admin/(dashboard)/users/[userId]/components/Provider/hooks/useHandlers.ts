import { useCoCRouter } from '@hooks';
import { useParams } from 'next/navigation';
import { USER_EDIT_PATH } from '../../../../../../../shared/constants/paths';

export const useHandlers = () => {
  const router = useCoCRouter();
  const { userId = '' } = useParams();
  const onClickList = () => {
    router.back();
  };
  const onClickEdit = () => {
    router.replace({
      url: USER_EDIT_PATH,
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
