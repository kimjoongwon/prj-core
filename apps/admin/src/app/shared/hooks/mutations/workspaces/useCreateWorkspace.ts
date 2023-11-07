import { useMutation } from '@apollo/client';
import { CREATE_WORKSPACE, GET_WORKSPACES } from '@gqls';
import { MutationOptions } from '@types';

export const useCreateWorkspace = (options?: MutationOptions) => {
  return useMutation(CREATE_WORKSPACE, {
    onCompleted: () => {
      if (options) {
        options.onCompleted && options.onCompleted();
      }
    },
    refetchQueries: [GET_WORKSPACES, 'Workspace'],
  });
};
