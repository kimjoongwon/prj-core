import { useCoCRouter } from '@hooks';
import { useMutations } from './useMutations';
import { useParams } from 'next/navigation';
import { USERS_PAGE_PATH } from '@constants';

export const useMeta = (context: ReturnType<typeof useMutations>) => {
  const {
    signUp: [signUp],
    updateUser: [updateUser],
  } = context;

  const router = useCoCRouter();
  const { userId } = useParams();

  const onClickSave = () => {
    if (userId === 'new') {
      signUp();
    } else {
      updateUser({
        variables: {
          updateUserInput: {
            id: userId as string,
            email: '',
            password: '',
            profile: {
              nickname: '',
              phone: '',
            },
          },
        },
      });
    }
  };

  const onClickCancel = () => {
    router.push({
      url: USERS_PAGE_PATH,
    });
  };

  return {
    onClickSave,
    onClickCancel,
  };
};
