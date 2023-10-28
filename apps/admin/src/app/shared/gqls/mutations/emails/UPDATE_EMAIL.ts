import { gql } from '@__generated__';

export const UPDATE_EMAIL = gql(`
  mutation DeleteEmail($id: String!) {
    deleteEmail(id: $id) {
      id
    }
  }

