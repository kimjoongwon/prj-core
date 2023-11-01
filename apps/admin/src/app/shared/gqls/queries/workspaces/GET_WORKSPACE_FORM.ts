import { gql } from '@__generated__';

export const GET_WORKSPACE_FORM = gql(`
  query GetWorkspaceForm($id: String!) {
    workspaceForm(id: $id) {
      name
    }
  }
`);