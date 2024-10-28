import {
  useCreateClassifications,
  useDeleteClassification,
} from '@shared/frontend';

export const useMutations = () => {
  const createClassifications = useCreateClassifications();
  const deleteClassifications = useDeleteClassification();

  return {
    createClassifications,
    deleteClassifications,
  };
};
