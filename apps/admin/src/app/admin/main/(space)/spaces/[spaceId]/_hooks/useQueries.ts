import { useGetSpaceSuspense } from '@shared/frontend';
import { useParams } from 'next/navigation';

export const useQueries = () => {
  const { spaceId } = useParams<{ spaceId: string }>();
  const { data: res } = useGetSpaceSuspense(spaceId);
  return {
    space: res.data,
  };
};
