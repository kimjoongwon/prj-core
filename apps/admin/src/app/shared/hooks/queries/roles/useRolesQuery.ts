import { GetRolesQueryVariables } from '@__generated__/graphql';
import { useSuspenseQuery } from '@apollo/client';
import { GET_ROLES } from '@gqls';

export const useRolesQuery = (variables: GetRolesQueryVariables) => {
  return useSuspenseQuery(GET_ROLES, {
    variables,
    fetchPolicy: 'cache-and-network',
  });
};