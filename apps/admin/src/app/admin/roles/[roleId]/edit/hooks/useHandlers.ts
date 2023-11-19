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
    createRole: [createRole],
    updateRole: [updateRole],
  } = mutations;

  const router = useCoCRouter();
  const { roleId } = useParams();

  const onClickSave = () => {
    if (roleId === 'new') {
      createRole({
        variables: {
          createRoleInput: {
            name: state.form.name,
          },
        },
      });
    } else {
      updateRole({
        variables: {
          updateRoleInput: {
            id: roleId as string,
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
