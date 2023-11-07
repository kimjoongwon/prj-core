import { useMutation } from '@apollo/client';
import { DELETE_WORKSPACE, GET_WORKSPACES } from '@gqls';
import { MutationOptions } from '@types';

export const useDeleteWorkspace = (options?: MutationOptions) => {
  return useMutation(DELETE_WORKSPACE, {
    onCompleted: () => {
      if (options) {
        options.onCompleted && options.onCompleted();
      }
    },
    refetchQueries: [GET_WORKSPACES, 'Workspace'],
  });
};
