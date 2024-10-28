import { useGetGroupsByQuerySuspense } from '@shared/frontend';
import { useParams } from 'next/navigation';

export const useQueries = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const { data: res } = useGetGroupsByQuerySuspense(
    {
      serviceId,
    },
    {
      query: {
        refetchOnMount: true,
        refetchOnWindowFocus: true,
      },
    },
  );

  return {
    groups: res.data || [],
  };
};
