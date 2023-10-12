import { gql } from '@__generated__';

export const GET_USER_FORM = gql(`#graphql
  query GetUserForm($cuid: String!){
    userForm(cuid: $cuid) {
      email
      password
      profile {
        nickname
        phone
      }
    }
  }
`);
