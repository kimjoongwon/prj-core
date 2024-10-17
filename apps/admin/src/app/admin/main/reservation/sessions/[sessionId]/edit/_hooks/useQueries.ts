import { useGetSession } from '@shared/frontend';
import { useParams } from 'next/navigation';

export const useQueries = () => {
  const { sessionId } = useParams<{ sessionId: string }>();

  const { data: getSessionResponse } = useGetSession(sessionId, {
    query: {
      enabled: sessionId === 'new' ? false : true,
    },
  });

  return {
    getSessionResponse: getSessionResponse,
  };
};
