import { useCoCRouter, useCreateRole, useUpdateRole } from '@hooks';
import { useRemoveRole } from '../../../../../shared/hooks/mutations/roles/useRemoveRole';

export const useMutations = () => {
  const router = useCoCRouter();
  return {
    createRole: useCreateRole({
      onCompleted: () => {
        router.back();
      },
    }),
    updateRole: useUpdateRole({
      onCompleted: () => {
        router.back();
      },
    }),
    removeRole: useRemoveRole({
      onCompleted: () => {
        router.back();
      },
    }),
  };
};
