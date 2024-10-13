import { useDeleteClassification } from '../../../../apis';

export const useMutations = () => {
  const { mutateAsync: deleteClassification } = useDeleteClassification();

  return {
    deleteClassification,
  };
};
