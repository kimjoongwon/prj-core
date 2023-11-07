import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr';
import { GET_WORKSPACE_FORM } from '@gqls';

export const useWorkspaceFormQuery = () => {
  return useSuspenseQuery(GET_WORKSPACE_FORM, {
    fetchPolicy: 'cache-and-network',
  });
};


