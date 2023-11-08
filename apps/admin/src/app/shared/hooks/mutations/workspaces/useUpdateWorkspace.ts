import { useMutation } from '@apollo/client';
import { UPDATE_WORKSPACE, GET_WORKSPACES, GET_WORKSPACE_FORM } from '@gqls';
import { MutationOptions } from '@types';

export const useUpdateWorkspace = (options?: MutationOptions) => {
  return useMutation(UPDATE_WORKSPACE, {
    onCompleted: () => {
      if (options) {
        options.onCompleted && options.onCompleted();
      }
    },
    refetchQueries: [
      GET_WORKSPACES,
      'GetWorkspaces',
      GET_WORKSPACE_FORM,
      'GetWorkspaceForm',
    ],
  });
};
