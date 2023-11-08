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
    createWorkspace: [createWorkspace],
    updateWorkspace: [updateWorkspace],
  } = mutations;

  const router = useCoCRouter();
  const { workspaceId } = useParams();

  const onClickSave = () => {
    if (workspaceId === 'new') {
      createWorkspace({
        variables: {
          createWorkspaceInput: state.form,
        },
      });
    } else {
      updateWorkspace({
        variables: {
          updateWorkspaceInput: {
            id: workspaceId as string,
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
