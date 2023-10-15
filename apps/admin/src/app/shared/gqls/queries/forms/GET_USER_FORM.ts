import { gql } from '@__generated__';

export const GET_USER_FORM = gql(`#graphql
  query GetUserForm($id: String!){
    userForm(id: $id) {
      email
      password
      profile {
        nickname
        phone
      }
    }
  }
`);
