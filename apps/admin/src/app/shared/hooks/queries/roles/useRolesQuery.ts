import { GetRolesQueryVariables } from '@__generated__/graphql';
import { skipToken } from '@apollo/client';
import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr';
import { GET_ROLES } from '@gqls';
import { isServer } from '@utils';

export const useRolesQuery = (variables: GetRolesQueryVariables) => {
  
  return useSuspenseQuery(GET_ROLES, isServer() ? skipToken : { variables });
};
