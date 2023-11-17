import { gql } from '@__generated__';

export const DELETE_SPACE = gql(`
  mutation DeleteSpace($id: String!) {
    deleteSpace(id: $id) {
      id
    }
  }
`);
