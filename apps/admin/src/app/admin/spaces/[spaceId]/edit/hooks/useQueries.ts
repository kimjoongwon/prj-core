import { useSpaceFormQuery } from '@hooks';
import { useParams } from 'next/navigation';

export const useQueries = () => {
  const { id = 'new' } = useParams();
  const spaceFormQuery = useSpaceFormQuery({
    id: id as string,
  });

  return {
    spaceFormQuery,
  };
};
