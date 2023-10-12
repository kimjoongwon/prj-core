import { useUserFormQuery, useUserQuery } from '@hooks';
import { useParams } from 'next/navigation';

export const useQueries = () => {
  const { userId = 'new' } = useParams();
  const userFormQuery = useUserFormQuery({
    cuid: userId as string,
  });

  return {
    userFormQuery,
  };
};
