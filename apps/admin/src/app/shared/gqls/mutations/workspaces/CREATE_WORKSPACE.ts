import { gql } from '@__generated__';

export const CREATE_WORKSPACE = gql(`
  mutation CreateWorkspace($createWorkspaceInput: CreateWorkspaceInput!) {
    createWorkspace(createWorkspaceInput: $createWorkspaceInput) {
      name
    }
  }
`);

