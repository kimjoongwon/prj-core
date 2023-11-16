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
  const { categoryId } = useParams();

  const onClickSave = () => {
    if (categoryId === 'new') {
      createGroup({
        variables: {
          createGroupInput: {
          },
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

