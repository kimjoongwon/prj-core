import { gql } from '@__generated__';

export const GET_USER_FORM = gql(`#graphql
  query GectUserForm($cuid: String!){
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
