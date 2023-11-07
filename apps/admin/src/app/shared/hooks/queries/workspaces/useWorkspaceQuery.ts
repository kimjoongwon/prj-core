import { GetWorkspaceQueryVariables } from '@__generated__/graphql';
import { skipToken, useSuspenseQuery } from '@apollo/client';
import { GET_WORKSPACE } from '@gqls';

export const useWorkspaceQuery = (variables: GetWorkspaceQueryVariables) => {
  return useSuspenseQuery(
    GET_WORKSPACE,
    variables.id === 'new' ? skipToken : { variables },
  );
};
