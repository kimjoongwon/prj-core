import { GetWorkspaceFormQueryVariables } from '@__generated__/graphql';
import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr';
import { GET_WORKSPACE_FORM } from '@gqls';

export const useWorkspaceFormQuery = (
  variables: GetWorkspaceFormQueryVariables,
) => {
  return useSuspenseQuery(GET_WORKSPACE_FORM, {
    variables,
    fetchPolicy: 'cache-and-network',
  });
};
