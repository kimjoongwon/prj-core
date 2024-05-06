import {
  getGetAllServiceQueryKey,
  useCreateService,
  useGetServiceById,
  useUpdateService,
} from '@shared/frontend';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

export const useQueries = () => {
  const queryClient = useQueryClient();
  const { serviceId } = useParams<{ serviceId: string }>();
  const { mutateAsync: createService } = useCreateService();
  const { mutateAsync: updateService } = useUpdateService();
  const { data: service, isLoading } = useGetServiceById(serviceId, {
    query: {
      enabled: !!serviceId,
    },
  });

  return {
    service,
    createService,
    updateService,
    refreshService: () =>
      queryClient.invalidateQueries({
        queryKey: getGetAllServiceQueryKey(),
      }),
  };
};
