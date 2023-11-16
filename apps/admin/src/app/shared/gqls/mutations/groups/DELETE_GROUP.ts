import { gql } from '@__generated__';

export const DELETE_GROUP = gql(`
  mutation DeleteGroup($id: String!) {
    deleteGroup(id: $id) {
      id
    }
  }
`);
