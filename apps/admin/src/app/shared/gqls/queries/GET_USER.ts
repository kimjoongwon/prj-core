import { gql } from '@__generated__';

export const GET_USER = gql(`#graphql
   query GetUser($cuid: String!) {
    user(cuid: $cuid) {
     email
     profile {
      nickname
      phone
     }
    }
   }
`);
