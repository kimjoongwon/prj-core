import { useGetServiceSuspense } from '@shared/frontend';

export const useQueries = (serviceId: string) => {
  const { data: res } = useGetServiceSuspense(serviceId);

  return {
    service: res?.data,
  };
};
