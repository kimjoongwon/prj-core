import { GetRoleFormQueryVariables } from '@__generated__/graphql';
import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr';
import { GET_ROLE_FORM } from '@gqls';

export const useRoleFormQuery = (variables: GetRoleFormQueryVariables) => {
  return useSuspenseQuery(GET_ROLE_FORM, {
    variables,
    fetchPolicy: 'cache-and-network',
  });
};
