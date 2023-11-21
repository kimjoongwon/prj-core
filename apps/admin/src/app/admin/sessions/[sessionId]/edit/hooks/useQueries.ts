import { useSessionFormQuery } from '@hooks';
import { useParams } from 'next/navigation';

export const useQueries = () => {
  const { sessionId = 'new' } = useParams();
  const sessionFormQuery = useSessionFormQuery({
    id: sessionId as string,
  });

  return {
    sessionFormQuery,
  };
};
