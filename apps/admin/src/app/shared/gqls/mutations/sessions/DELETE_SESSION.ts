import { gql } from '@__generated__';

export const DELETE_SESSION = gql(`
  mutation DeleteSession($id: String!) {
    deleteSession(id: $id) {
      id
    }
  }
`);
