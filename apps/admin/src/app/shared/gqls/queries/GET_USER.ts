import { gql } from '@__generated__';

export const GET_USER = gql(`#graphql
   query GetUser($id: String!) {
    user(id: $id) {
     email
     profile {
      nickname
      phone
     }
    }
   }
`);
