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
    createSpace: [createSpace],
    updateSpace: [updateSpace],
  } = mutations;

  const router = useCoCRouter();
  const { spaceId } = useParams();

  const onClickSave = () => {
    if (spaceId === 'new') {
      createSpace({
        variables: {
          createSpaceInput: state.form,
        },
      });
    } else {
      updateSpace({
        variables: {
          updateSpaceInput: {
            id: spaceId as string,
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
