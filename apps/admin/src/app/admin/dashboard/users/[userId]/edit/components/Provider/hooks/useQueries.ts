import { useUserQuery } from '@hooks';
import { useParams } from 'next/navigation';

export const useQueries = () => {
  const { userId = '' } = useParams();
  const userQuery = useUserQuery(userId as string);

  console.log(userQuery);
  return {
    userQuery,
  };
};
