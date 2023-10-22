import { gql } from '@__generated__';

export const GET_USER = gql(`
  query GetUser($id: String!) {
    user(id: $id) {
      id
      email
      profile {
        nickname
        phone
      }
    }
  }
`);
