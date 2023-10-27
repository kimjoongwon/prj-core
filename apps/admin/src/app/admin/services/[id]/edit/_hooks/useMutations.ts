import {
  useCoCRouter,
  useCreateService,
  useDeleteService,
  useUpdateService,
} from '@hooks';

export const useMutations = () => {
  const router = useCoCRouter();
  const [updateService] = useUpdateService({
    onCompleted: () => router.back(),
  });
  const [deleteService] = useDeleteService({
    onCompleted: () => router.back(),
  });
  const [createService] = useCreateService({
    onCompleted: () => router.back(),
  });
  return {
    updateService,
    deleteService,
    createService,
  };
};
