import { gql } from '@__generated__';

export const UPDATE_WORKSPACE = gql(`
  mutation UpdateWorkspace($updateWorkspaceInput: UpdateWorkspaceInput!) {
    updateWorkspace(updateWorkspaceInput: $updateWorkspaceInput) {
      id
    }
  }
`);
