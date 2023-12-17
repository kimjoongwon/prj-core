import { GetUsersQueryVariables } from '@__generated__/graphql';
import { skipToken } from '@apollo/client';
import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr';
import { GET_USERS } from '@gqls';
import { isServer } from '@utils';

export const useUsersQuery = (variables: GetUsersQueryVariables) => {
  return useSuspenseQuery(
    GET_USERS,
    isServer()
      ? skipToken
      : {
          variables,
        },
  );
};
