import { gql } from '@__generated__';

export const GET_ROLE_FORM = gql(`
  query GetRoleForm($id: String!) {
    roleForm(id: $id) {
      name
      options {
        name
        value
      }
    }
  }
`);
