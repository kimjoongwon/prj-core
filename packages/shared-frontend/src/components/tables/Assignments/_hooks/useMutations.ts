import { useDeleteAssignment } from '../../../../apis';

export const useMutations = () => {
  const { mutateAsync: deleteAssignment } = useDeleteAssignment();

  return {
    deleteAssignment,
  };
};
