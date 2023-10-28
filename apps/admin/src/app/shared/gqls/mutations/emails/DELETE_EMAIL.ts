import { gql } from '@__generated__';

export const DELETE_EMAIL = gql(`
  mutation DeleteEmail($id: String!) {
    deleteEmail(id: $id) {
      id
    }
  }

