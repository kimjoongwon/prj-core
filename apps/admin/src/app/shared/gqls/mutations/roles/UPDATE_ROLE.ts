import { gql } from '@__generated__';

export const UPDATE_ROLE = gql(`
  mutation DeleteRole($id: String!) {
    deleteRole(id: $id) {
      id
    }
  }
`);
