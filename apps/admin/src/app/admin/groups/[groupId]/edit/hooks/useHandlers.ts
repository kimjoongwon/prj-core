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
    createGroup: [createGroup],
    updateGroup: [updateGroup],
  } = mutations;

  const router = useCoCRouter();
  const { groupId } = useParams();

  const onClickSave = () => {
    if (groupId === 'new') {
      createGroup({
        variables: {
          createGroupInput: state.form,
        },
      });
    } else {
      updateGroup({
        variables: {
          updateGroupInput: {
            id: groupId as string,
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
