import { useUserQuery } from '@hooks';
import { useParams } from 'next/navigation';

export const useQueries = () => {
  const { userId = '' } = useParams();
  const query = useUserQuery(userId as string);

  return {
    userQuery: query,
  };
};
