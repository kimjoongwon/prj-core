import { GetSessionsQueryVariables } from '@__generated__/graphql';
import { useSuspenseQuery } from '@apollo/client';
import { GET_SESSIONS } from '@gqls';

export const useSessionsQuery = (variables: GetSessionsQueryVariables) => {
  return useSuspenseQuery(GET_SESSIONS, {
    variables,
    fetchPolicy: 'cache-and-network',
  });
};