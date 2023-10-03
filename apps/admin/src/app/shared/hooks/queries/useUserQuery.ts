import { skipToken } from '@apollo/client';
import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr';
import { GET_USER } from '@gqls';

export const useUserQuery = (id: string) => {
  return useSuspenseQuery(
    GET_USER,
    id === 'new'
      ? skipToken
      : {
          variables: { id },
        },
  );
};
