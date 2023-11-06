import { gql } from '@__generated__';

export const DELETE_WORKSPACE = gql(`
  mutation DeleteWorkspace($id: String!) {
    deleteWorkspace(id: $id) {
      id
    }
  }
`);
