import { gql } from '@__generated__';

export const GET_USER_FORM = gql(`#graphql
  query GetUserForm($id: String!){
    userForm(id: $id) {
      name
      email
      password
      roleId
      spaceId
      roleOptions {
        text
        value
      }
      spaceOptions {
        text
        value
      }
    }
  }
`);
