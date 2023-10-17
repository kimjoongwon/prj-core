import { GetWorkspaceQueryVariables } from '@__generated__/graphql';
import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr';
import { GET_WORKSPACES } from '@gqls';

export const useWorkspacesQuery = (variables: GetWorkspaceQueryVariables) => {
  return useSuspenseQuery(GET_WORKSPACES, {
    variables,
    fetchPolicy: 'cache-and-network',
  });
};
