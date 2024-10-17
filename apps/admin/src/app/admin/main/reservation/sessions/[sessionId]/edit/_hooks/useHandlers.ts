import {
  CreateSessionDto,
  galaxy,
  revalidatePathGetSessionsByQuery,
  UpdateSessionDto,
} from '@shared/frontend';
import { useState } from './useState';
import { useParams } from 'next/navigation';
import { useMutations } from './useMutataions';

export const useHandlers = (props: {
  state: ReturnType<typeof useState>;
  mutations: ReturnType<typeof useMutations>;
}) => {
  const {
    state,
    mutations: { createSession, updateSession },
  } = props;
  const { sessionId } = useParams<{ sessionId: string }>();
  const form = state.form;

  const update = () => {
    updateSession.mutateAsync({
      sessionId,
      data: form as UpdateSessionDto,
    });
  };

  const create = async () => {
    await createSession.mutateAsync({
      data: form as CreateSessionDto,
    });
    revalidatePathGetSessionsByQuery({});
  };

  const goBack = () => {
    galaxy.router.back();
  };

  const onClickSave = () => {
    if (sessionId === 'new') {
      create();
    } else {
      update();
    }
    goBack();
  };

  const onClickList = () => {
    goBack();
  };

  return {
    onClickSave,
    onClickList,
  };
};
