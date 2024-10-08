import { useDeleteGroup } from '../../../../apis';

export const useMutations = () => {
  const { mutateAsync: deleteGroup } = useDeleteGroup();

  return {
    deleteGroup,
  };
};
