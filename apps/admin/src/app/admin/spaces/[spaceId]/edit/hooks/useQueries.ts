import { useSpaceFormQuery } from '@hooks';
import { useParams } from 'next/navigation';

export const useQueries = () => {
  const { spaceId = 'new' } = useParams();
  const spaceFormQuery = useSpaceFormQuery({
    id: spaceId as string,
  });

  return {
    spaceFormQuery,
  };
};
