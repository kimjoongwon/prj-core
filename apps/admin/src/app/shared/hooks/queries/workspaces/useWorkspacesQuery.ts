import { GetWorkspacesQueryVariables } from '@__generated__/graphql';
import { useSuspenseQuery } from '@apollo/client';
import { GET_WORKSPACES } from '@gqls';

export const useWorkspacesQuery = (variables: GetWorkspacesQueryVariables) => {
  return useSuspenseQuery(GET_WORKSPACES, {
    variables,
    fetchPolicy: 'cache-and-network',
  });
};