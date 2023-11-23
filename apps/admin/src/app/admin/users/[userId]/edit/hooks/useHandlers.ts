import { useCoCRouter } from '@hooks';
import { useMutations } from './useMutations';
import { useParams } from 'next/navigation';
import { USERS_PAGE_PATH } from '@constants';
import { useState } from './useState';
import { omit } from 'lodash-es';

export const useHandlers = (context: {
  mutations: ReturnType<typeof useMutations>;
  state: ReturnType<typeof useState>;
}) => {
  const {
    state,
    mutations: {
      createUser: [createUser],
      updateUser: [updateUser],
    },
  } = context;

  const router = useCoCRouter();
  const { userId } = useParams();

  const onClickSave = () => {
    const form = omit(state.formState, ['roleOptions', 'spaceOptions']);

    if (userId === 'new') {
      createUser({
        variables: {
          createUserInput: form,
        },
      });
    } else {
      updateUser({
        variables: {
          updateUserInput: {
            id: userId as string,
            ...form,
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
