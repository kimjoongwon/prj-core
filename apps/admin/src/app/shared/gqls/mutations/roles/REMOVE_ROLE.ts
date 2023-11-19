import { gql } from '@__generated__';

export const REMOVE_ROLE = gql(`
  mutation RemoveRole($id: String!) {
    removeRole(id: $id) {
      id
    }
  }
`);
