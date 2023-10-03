import { GetUsersQueryVariables } from '@__generated__/graphql';
import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr';
import { GET_USERS } from '@gqls';

export const useUsersQuery = (variables: GetUsersQueryVariables) => {
  return useSuspenseQuery(GET_USERS, {
    variables,
    fetchPolicy: 'cache-and-network',
  });
};
