import { GetRolesQueryVariables } from '@__generated__/graphql';
import { skipToken, useSuspenseQuery } from '@apollo/client';
import { useQuery } from '@apollo/experimental-nextjs-app-support/ssr';
import { GET_ROLES } from '@gqls';

export const useRolesQuery = (variables: GetRolesQueryVariables) => {
  return useSuspenseQuery(
    GET_ROLES,
    // isServer() ? skipToken : { variables },
    { variables, fetchPolicy: 'cache-and-network' },
    // fetchPolicy: 'cache-and-network',
    // errorPolicy: 'all',
  );
};
