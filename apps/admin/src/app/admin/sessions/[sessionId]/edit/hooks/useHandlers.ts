import { useCoCRouter } from '@hooks';
import { useMutations } from './useMutations';
import { useParams } from 'next/navigation';
import { useState } from './useState';

export const useHandlers = ({
  mutations,
  state,
}: {
  mutations: ReturnType<typeof useMutations>;
  state: ReturnType<typeof useState>;
}) => {
  const {
    createSession: [createSession],
    updateSession: [updateSession],
  } = mutations;  

  const router = useCoCRouter();
  const { sessionId } = useParams();

  const onClickSave = () => {
    if (sessionId === 'new') {
      createSession({
        variables: {
          createSessionInput: state.form,
        },
      });
    } else {
      updateSession({
        variables: {
          updateSessionInput: {
            id: sessionId as string,
            ...state.form,
          },
        },
      });
    }
  };

  const onClickCancel = () => {
    router.back();
  };

  return {
    onClickSave,
    onClickCancel,
  };
};

