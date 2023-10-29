import { gql } from '@__generated__';

export const DELETE_ROLE = gql(`
  mutation DeleteRole($id: String!) {
    deleteRole(id: $id) {
      id
    }
  }
`);
